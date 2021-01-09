function getevents(obj) { return Object.entries(obj).filter(([key, value]) => key.startsWith('on') && typeof value === 'function').reduce((events, [key, value]) => ({ ...events, [key]: value }), {}); }
export { getevents };
export function to(promise) { // wraps and promise [error, response] format 
    return promise.then((data) => [null, data]).catch((error) => [error, null]);
}
export function getIndex(array, value) { let { length } = array; while (length--) { if (array[length] === value) { return length; } } return -1; }
export function getIndexes(array, value) { return array.reduce((acc, el, i) => (el === value ? [...acc, i] : acc), []); }
export function getLastItem(array) { const length = array == null ? 0 : array.length; return length ? array[length - 1] : undefined; }
export function insertArray(array, fromIndex, ...items) { return [...array.slice(0, fromIndex), ...items, ...array.slice(fromIndex)]; }
export function insertString(string, fromIndex, ...newstring) { return `${string.slice(0, fromIndex)}${newstring.join('')}${string.slice(fromIndex)}`; }
export function isNull(value) { return value === null; }
export function isNumber(param) { return typeof param === 'number' && !isNaN(param); }
export function isObject(value) { return typeof value === 'object' && value !== null; }
export function isFunction(fn) { return typeof fn === 'function'; }
export function isUndefined(value) { return value === undefined; }
export function clampNumBetween({ min, max, num }) { // returns min > num > max
    return Math.min(Math.max(num, min), max);
}
export function getUnique(arr) { return [...new Set(arr)]; }
export function checkValidation(value, schema) { return schema.validate(value, { strict: true, abortEarly: false }); }
export function printValidationErr(validErrs) {
    const toPrint = validErrs.reduce((obj, { path, message }) => ({ ...obj, [path]: message }), {}); // eslint-disable-next-line no-console 
    console.error('Invalid Object Properties'); // eslint-disable-next-line no-console 
    console.error(toPrint);
}

export function objectHasValue(object, value) { return Object.values(object).includes(value); }
/** * * @param {*} url */
export const isValidUrl = (url) => /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url);

