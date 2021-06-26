/**
 * Duck type check for date object
 *
 * @param {Date} date Date object to check
 * @returns {boolean} true if object is a Date
 */
export const isDate = (date) => {
  return typeof date.getMonth === "function" && date instanceof Date;
};
