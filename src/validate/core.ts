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
  const errors = {} as IError;

  this.hasAttribute("_required")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (utils.isEmpty(value)) {
        errors[name] = "this field is required";
      }
    }
  );

  this.hasAttribute("_number")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isNumber(value)) {
          errors[name] = "this value is not number";
        }
      }
    }
  );

  this.hasAttribute("_email")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidEmail(value)) {
          errors[name] = "this email is not valid";
        }
      }
    }
  );

  this.hasAttribute("_min").forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (parseFloat(value) < parseFloat(attributes._min.value)) {
          errors[name] = `min ${attributes._min.value} required`;
        }
      }
    }
  );

  this.hasAttribute("_max")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (parseFloat(value) > parseFloat(attributes._max.value)) {
          errors[name] = `max ${attributes._max.value} allowed`;
        }
      }
    }
  );

  this.hasAttribute("_minlength")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (value.length < parseInt(attributes._minlength.value, 10)) {
          errors[name] = `min length ${attributes._minlength.value} required`;
        }
      }
    }
  );

  this.hasAttribute("_maxlength")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (value.length > parseInt(attributes._maxlength.value, 10)) {
          errors[name] = `max length ${attributes._maxlength.value} allowed`;
        }
      }
    }
  );

  this.hasAttribute("_length")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (value.length !== parseInt(attributes._length.value, 10)) {
          errors[name] = `required length is ${attributes._length.value} `;
        }
      }
    }
  );

  this.hasAttribute("_pin")?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidPin(value)) {
        errors[name] = "this pin is not valid";
      }
    }
  });

  this.hasAttribute("_amount")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidAmount(value)) {
          errors[name] = "this amount is not valid";
        }
      }
    }
  );

  this.hasAttribute("_pan")?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidPan(value)) {
        errors[name] = "this pan is not valid";
      }
    }
  });

  this.hasAttribute("_panbasic")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidPanBasic(value)) {
          errors[name] = "this pan is not valid";
        }
      }
    }
  );

  this.hasAttribute("_phone")?.forEach(
    ({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidPhone(value)) {
          errors[name] = "this phone number is not valid";
        }
      }
    }
  );

  this.hasAttribute("_customregex")?.forEach(
    ({ name, value, attributes }: any): void => {
      if (!utils.isEmpty(value)) {
        const regex = RegExp(attributes._customregex.value);
        if (!regex.test(String(value.trim()))) {
          errors[name] = "this value does not match provided regex";
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
                ? (errors[name] = "passwords is not strong")
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
            : (errors[name] = "please provide password repeat");
        }

        password !== passwordRepeat
          ? (errors[finalName] = "passwords does not match")
          : (errors[finalName] = "");
      }
    );
  }

  return errors;
};
