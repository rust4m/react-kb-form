import { IHTMLInputEvent } from "../models/index";

/* Utils starts*/

function Utils(): void {
  /* here something for you tslint */
}

/* method to check that provided value is number */
Utils.prototype.isNumber = function (num: string): boolean {
  const regex = /^[+-]?\d+(\.\d+)?$/;
  return regex.test(String(num.trim()));
};

/* method to check that typed event is number */
Utils.prototype.isNumberEvent = function (event: IHTMLInputEvent): boolean {
  const charCode = event.which ? event.which : event.keyCode;
  if (
    (((charCode as unknown) as number) >= 48 &&
      ((charCode as unknown) as number) <= 57) ||
    (((charCode as unknown) as number) >= 96 &&
      ((charCode as unknown) as number) <= 105)
  ) {
    return true;
  }
  return false;
};

/* method to check email validity */
Utils.prototype.isValidEmail = function (email: string): boolean {
  const regex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;
  return regex.test(String(email.trim()));
};

/* method to check that provided value is not empty */
Utils.prototype.isEmpty = function (value: string): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

/* method to check PIN validity */
Utils.prototype.isValidPin = function (pin: string): boolean {
  const regex = /^[a-np-zA-NP-Z0-9]{7}$/;
  return regex.test(String(pin.trim()));
};

/* method to check amount validity */
Utils.prototype.isValidAmount = function (amount: string): boolean {
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(String(amount.trim()));
};

/* method to check phone validity */
Utils.prototype.isValidPhone = function (phone: string): boolean {
  const regex = /^^((\+994)|0)((12[3-5]\d{6})|(((99)|(5[015])|(7[07]))[1-9]\d{6}))$/;
  return regex.test(String(phone.trim()));
};

/* method to check password strength */
Utils.prototype.isStrongPassword = function (password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  return regex.test(String(password.trim()));
};

/* method to check PAN validity without Luhn algorithm */
Utils.prototype.isValidPanBasic = function (pan: string): boolean {
  const regex = /^(\d{16}|\d{19})?$/;
  return regex.test(String(pan.trim()));
};

/* method to check PAN validity ,Luhn algorithm */
Utils.prototype.isValidPan = function (pan: string): boolean {
  if (/[^0-9-\s]+/.test(pan)) {
    return false;
  }

  let nCheck = 0;
  let bEven = false;
  const newPan = pan.replace(/\D/g, "");

  for (let n = newPan.length - 1; n >= 0; n--) {
    const cDigit = newPan.charAt(n);
    let nDigit = parseInt(cDigit, 10);

    if (bEven && (nDigit *= 2) > 9) {
      nDigit -= 9;
    }

    nCheck += nDigit;
    bEven = !bEven;
  }

  return nCheck % 10 === 0;
};

/* Utils ends*/

export default Object.create(Utils.prototype);
