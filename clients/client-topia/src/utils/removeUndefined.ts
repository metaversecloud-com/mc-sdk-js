/**
 * Parses object, removes keys with undefined value, and returns clean object.
 */
export const removeUndefined = (obj: { [key: string]: any }) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};
