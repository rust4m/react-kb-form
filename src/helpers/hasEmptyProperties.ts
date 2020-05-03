import utils from "../utils/index";

/* returns true if each property in object is empty */
export default function hasEmptyProperties(obj: any): any {
  return Object.values(obj).every((item) => utils.isEmpty(item));
}
