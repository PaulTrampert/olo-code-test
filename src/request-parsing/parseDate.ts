import isISODate from 'is-iso-date';
import Logger from "../logger";

export const parseDate = value => {
    if (typeof(value) === "string" && isISODate(value)) {
        const result = new Date(value);
        if (!isNaN(result.getTime()))
            return result;
    }

    Logger.warn(`${value} is not a valid ISO Date string`);
    return undefined;
}