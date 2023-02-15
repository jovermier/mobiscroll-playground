import { isDate, isNull, isObject, isString } from 'lodash';

function mobiDateToDate(date: string): Date;
function mobiDateToDate(date: Date): Date;
function mobiDateToDate(date: undefined): undefined;
function mobiDateToDate(date: null): null;
// eslint-disable-next-line @typescript-eslint/ban-types
function mobiDateToDate(date: {}): never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mobiDateToDate(date: any): never;
// eslint-disable-next-line @typescript-eslint/ban-types
function mobiDateToDate(date: string | {} | Date | null | undefined): Date | null | undefined {
  if (isString(date)) {
    return new Date(date);
  }
  if (isObject(date)) {
    if (isDate(date)) {
      return date;
    }
    return new Date(date as Date);
  }

  if (isNull(date)) {
    return null;
  }
  return undefined;
}

export { mobiDateToDate };
