import {parseDate} from "./parseDate";

describe('parseDate', () => {
    describe('when the given string is a valid date', () => {
        const validData = [
            {toParse: "2022-01-01T05:00:00.000Z", expected: "2022-01-01T05:00:00.000Z"},
            {toParse: "2022-01-02T00:00:00.000-04:00", expected: "2022-01-02T04:00:00.000Z"}
        ]

        it.each(validData)('returns a Date object ($toParse, $expected)', ({toParse, expected}) => {
            const result = parseDate(toParse);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toBe(expected);
        })
    });

    describe('when the given string is not a valid date', () => {
        const invalidData = [
            {toParse: "2022-45-92"},
            {toParse: "floop"},
            {toParse: "2022-45-92T00:00:00.000Z"},
            {toParse: "2022-12-32T00:00:00.000Z"},
        ]

        it.each(invalidData)('returns undefined ($toParse)', ({toParse}) => {
            const result = parseDate(toParse)

            expect(result).toBeUndefined();
        })
    });
})