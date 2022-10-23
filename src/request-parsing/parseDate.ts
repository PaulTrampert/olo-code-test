import isISODate from 'is-iso-date';
import Logger from "../logger";

export const parseDate = value => {
    if (typeof(value) === "string" && isISODate(value))
        return new Date(value);
    Logger.warn(`${value} is not a valid ISO Date string`);
    return undefined;
}