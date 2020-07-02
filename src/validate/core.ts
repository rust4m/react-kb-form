import { IError, IInputElement } from "../models/index";
import utils from "../utils/index";

/* core validate ctor function */
export default function Validate(this: any, array: IInputElement[]): void {
  this.array = array;
}

/* returns true if each object in array is empty */
// Array.prototype.hasEmptyProperties = function() {
//   return this.every(item => Object.getOwnPropertyNames(item).length === 0);
// };

/* returns array of inputs with given attribute */
Validate.prototype.hasAttribute = function (attr: string): IInputElement[] {
  return this.array?.filter((x: IInputElement) =>
    x.attributes.hasOwnProperty(attr)
  );
};

/* method for validating form */
Validate.prototype.validate = function (): IError {
  const errors = {} as any;

  this.hasAttribute("_required")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (utils.isEmpty(value)) {
        errors[name] = true;
      }
    }
  );

  this.hasAttribute("_number")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isNumber(value)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_email")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidEmail(value)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_min").forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (parseFloat(value) < parseFloat(attributes._min.value)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_max")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (parseFloat(value) > parseFloat(attributes._max.value)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_minlength")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (value.length < parseInt(attributes._minlength.value, 10)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_maxlength")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (value.length > parseInt(attributes._maxlength.value, 10)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_length")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (value.length !== parseInt(attributes._length.value, 10)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_pin")?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidPin(value)) {
        errors[name] = true;
      }
    }
  });

  this.hasAttribute("_amount")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidAmount(value)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_pan")?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidPan(value)) {
        errors[name] = true;
      }
    }
  });

  this.hasAttribute("_panbasic")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidPanBasic(value)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_phone")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidPhone(value)) {
          errors[name] = true;
        }
      }
    }
  );

  this.hasAttribute("_customregex")?.forEach(
    ({ name, value, attributes }: any): void => {
      if (!utils.isEmpty(value)) {
        const regex = RegExp(attributes._customregex.value);
        if (!regex.test(String(value.trim()))) {
          errors[name] = true;
        }
      }
    }
  );

  /* TODO refactor */
  const arr = [
    ...this?.hasAttribute("_password"),
    ...this?.hasAttribute("_passwordrepeat"),
  ];

  if (arr.length) {
    let password: string;
    let passwordRepeat: string;
    let finalName: string;

    this.hasAttribute("_password")?.forEach(
      ({ value }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
          this.hasAttribute("_strongpassword")?.forEach(
            ({ value, name }: IInputElement) => {
              !utils.isStrongPassword(value)
                ? (errors[name] = true)
                : (password = value) && (errors[name] = "");
            }
          );

          password = value;
        }
      }
    );

    this.hasAttribute("_passwordrepeat")?.forEach(
      ({ name, value }: IInputElement): void => {
        if (!utils.isEmpty(password)) {
          !utils.isEmpty(value)
            ? (passwordRepeat = value) && (finalName = name)
            : (errors[name] = true);
        }

        password !== passwordRepeat
          ? (errors[finalName] = true)
          : (errors[finalName] = "");
      }
    );
  }

  return errors;
};
