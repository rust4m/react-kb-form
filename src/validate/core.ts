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
    ({ name, value, attributes }: IInputElement): void => {
      if (utils.isEmpty(value)) {
        errors[name] = attributes._required.value;
      }
    }
  );

  this.hasAttribute("_number")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isNumber(value)) {
          errors[name] = attributes._number.value;
        }
      }
    }
  );

  this.hasAttribute("_email")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidEmail(value)) {
          errors[name] = attributes._email.value;
        }
      }
    }
  );

  this.hasAttribute("_min").forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (parseFloat(value) < parseFloat(attributes._min.value)) {
          errors[name] = `min value is ${attributes._min.value}`;
        }
      }
    }
  );

  this.hasAttribute("_max")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (parseFloat(value) > parseFloat(attributes._max.value)) {
          errors[name] = `max value is ${attributes._max.value}`;
        }
      }
    }
  );

  this.hasAttribute("_minlength")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (value.length < parseInt(attributes._minlength.value, 10)) {
          errors[name] = `min length is ${attributes._minlength.value}`;
        }
      }
    }
  );

  this.hasAttribute("_maxlength")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (value.length > parseInt(attributes._maxlength.value, 10)) {
          errors[name] = `max length is ${attributes._maxlength.value}`;
        }
      }
    }
  );

  this.hasAttribute("_length")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (value.length !== parseInt(attributes._length.value, 10)) {
          errors[name] = `length must be ${attributes._length.value}`;
        }
      }
    }
  );

  this.hasAttribute("_pin")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidPin(value)) {
          errors[name] = attributes._pin.value;
        }
      }
    }
  );

  this.hasAttribute("_amount")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidAmount(value)) {
          errors[name] = attributes._amount.value;
        }
      }
    }
  );

  this.hasAttribute("_pan")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidPan(value)) {
          errors[name] = attributes._pan.value;
        }
      }
    }
  );

  this.hasAttribute("_panbasic")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidPanBasic(value)) {
          errors[name] = attributes._panbasic.value;
        }
      }
    }
  );

  this.hasAttribute("_phone")?.forEach(
    ({ name, value, attributes }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        if (!utils.isValidPhone(value)) {
          errors[name] = attributes._phone.value;
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
    let passWordErr: string;

    this.hasAttribute("_password")?.forEach(
      ({ value, attributes }: IInputElement): void => {
        passWordErr = attributes._password.value;

        if (!utils.isEmpty(value)) {
          this.hasAttribute("_strongpassword")?.forEach(
            ({ value, name, attributes }: IInputElement) => {
              !utils.isStrongPassword(value)
                ? (errors[name] = attributes._strongpassword.value)
                : (password = value) && (errors[name] = "");
            }
          );

          password = value;
        }
      }
    );

    this.hasAttribute("_passwordrepeat")?.forEach(
      ({ name, value, attributes }: IInputElement): void => {
        if (!utils.isEmpty(password)) {
          !utils.isEmpty(value)
            ? (passwordRepeat = value) && (finalName = name)
            : (errors[name] = attributes._passwordrepeat.value);
        }

        password !== passwordRepeat
          ? (errors[finalName] = passWordErr)
          : (errors[finalName] = "");
      }
    );
  }

  return errors;
};
