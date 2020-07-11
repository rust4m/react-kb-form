/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /* */ /* */ /* */ /*  */ /*  */
/*  ####################################################################################################  */
/*  ####################################################################################################  */
/*  ##    Made with ❤ by Rustam Islamov and contributed by Sabuhi Nazarov ,all rights reserved :)    ##  */
/*  ####################################################################################################  */
/*  ####################################################################################################  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /* */ /*  */ /*  */ /* */ /* */ /*  */

import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import hasEmptyProperties from "../helpers/hasEmptyProperties";
import {
  ICurrent,
  IFormData,
  IFormStatus,
  IHTMLInputEvent,
  IUseKBform,
} from "../models/index";
import utils from "../utils/index";
import Validate from "../validate/core";

export default function useKBform(): IUseKBform {
  /* validated form state for client */
  const [formState, setFormState] = useState<IFormData[]>();

  /* errors state for client */
  const [errorState, setErrorState] = useState<any>({} as any);

  /* watch mode state */
  const [watchState, setWatchState] = useState<IFormData[]>();

  /* status of each form to be sent to client */
  const [formStatus, setFormStatus] = useState<IFormStatus>();

  /* env mode  { 'dev' || 'prod' }*/
  const [envMode, setEnvMode] = useState<string>("prod");

  /* init refs array */
  const { current } = useRef<ICurrent[]>([]);

  /* get existing errors */
  const existingErrors = useCallback(
    (formInstance) => formInstance.validate(),
    []
  );

  /* helper function to find refs array which does not match given node name */
  const filterRefsExcept = useCallback(
    (refs: any, nodeNameExcept: string) =>
      [...refs].filter(({ nodeName }: any) => nodeName !== nodeNameExcept),
    []
  );

  const createFormObjects = useCallback(() => {
    const formInputs = [] as any;
    current.forEach(({ elements, attributes }) => {
      [...elements].forEach((el) => {
        if (el.nodeName !== "BUTTON" && !el.attributes._ignore) {
          formInputs.push({ [attributes._formname.value]: el });
        }
      });
    });

    return formInputs;
  }, []);

  /* helper function to create form objects with the value of  { [name] : value } input */
  const createSortedFormObjects = useCallback(() => {
    const sortedFormState = createFormObjects().reduce(
      (acc: ICurrent, currentForm: ICurrent) => {
        for (const formName in currentForm) {
          if (!acc[formName]) {
            acc[formName] = {};
          }

          /* TODO refactor this if else shit :)) */
          const { value, files, name, attributes } = currentForm[formName];

          if (files) {
            acc[formName][name] = files;
          } else if (value === "true" || value === "false") {
            acc[formName][name] = JSON.parse(value);
          } else if (utils.isNumber(value) && attributes._number?.value) {
            acc[formName][name] = parseFloat(value);
          } else {
            acc[formName][name] = value;
          }
        }
        return acc;
      },
      {}
    );

    return sortedFormState;
  }, [createFormObjects]);

  const onClick = useCallback(
    (form: ICurrent) => {
      const formInstance = new (Validate as any)(
        filterRefsExcept(form, "BUTTON")
      );
      setErrorState(existingErrors(formInstance));

      if (hasEmptyProperties(existingErrors(formInstance))) {
        setFormStatus({ [form.attributes._formname.value]: "success" });
      }
    },
    [filterRefsExcept, setErrorState, existingErrors, setFormStatus]
  );

  /* prevent user actions on keydown*/
  const onKeyDown = useCallback((event: any, currentFormEl: ICurrent) => {
    const allowedKeyCodes =
      event.keyCode !== 8 && event.keyCode !== 190 && event.keyCode !== 46;
    // event.keyCode !== 109 &&
    // event.keyCode !== 107 &&
    // event.keyCode !== 144;

    const numVal = currentFormEl.attributes?._number?.value;
    const lengthVal = currentFormEl.attributes?._length?.value;

    /* TODO refactor this if else shit)) */
    if (numVal && lengthVal) {
      if (
        parseInt(lengthVal, 10) === currentFormEl.value?.length &&
        allowedKeyCodes
      ) {
        event.preventDefault();
      }

      if (allowedKeyCodes) {
        return utils.isNumberEvent(event);
      }
    }

    if (numVal) {
      if (allowedKeyCodes) {
        return utils.isNumberEvent(event);
      }
    }

    if (parseInt(lengthVal, 10) === currentFormEl.value?.length) {
      if (allowedKeyCodes) {
        return event.preventDefault();
      }
    }
  }, []);

  /* enable watchMode only if envMode setted to 'dev' , you can use watch mode to track form state changes while debugging*/
  useEffect(() => {
    if (envMode === "dev") {
      current.forEach(({ elements }) =>
        [...elements].forEach(
          (el) => (el.onkeyup = () => setWatchState(createSortedFormObjects()))
        )
      );
    }
  }, [envMode]);

  /* function to register all forms */
  const _register = useCallback(
    (formRef: ICurrent) => {
      if (formRef !== null) current.push(formRef);

      current.forEach((form) => {
        if (form) {
          [...form.elements].forEach((el) => {
            if (el.nodeName === "BUTTON" && el.type === "submit") {
              el.onclick = () => onClick(form);
            }

            if (el.nodeName !== "BUTTON") {
              el.onkeydown = (event: IHTMLInputEvent) => onKeyDown(event, el);
            }
          });

          form.onsubmit = (event: IHTMLInputEvent) => event.preventDefault();
        }
      });
    },
    [onKeyDown, onClick]
  );

  /* submit function */
  const _handleSubmit = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();

      if (hasEmptyProperties(errorState)) {
        setFormState(createSortedFormObjects());
      }
    },
    [setFormState, errorState, createSortedFormObjects]
  );

  /* set env mode */
  const _envMode = useCallback((mode: string) => setEnvMode(mode), [
    setEnvMode,
  ]);

  /* ability ro reset all form element's value by _formname */
  const _reset = useCallback((formName: string) => {
    current.forEach(({ attributes, elements }) => {
      if (attributes._formname.value === formName) {
        [...elements].forEach((el) => {
          if (el.nodeName !== "BUTTON") {
            el.value = "";
          }

          /* temporary shit */
          // if (el.attributes._resetbtn) {
          //   el.children.forEach(({ value }: ICurrent) => {
          //     if (value === 'true') {
          //       el.click();
          //     }
          //   });
          // }
        });
      }
    });
  }, []);

  return {
    _register,
    watchState,
    formState,
    errorState,
    formStatus,
    _handleSubmit,
    _envMode,
    _reset,
  };
}
