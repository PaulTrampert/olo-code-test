import {IsDateOnInterval} from "./IsDateOnInterval";
import {validate} from "class-validator";

class TestClass {
    @IsDateOnInterval(15)
    date: Date
}

describe("IsDateOnInterval", () => {
    let subject: TestClass;

    beforeEach(() => {
        subject = new TestClass();
    })

    describe("When the date is on the specified interval", () => {
        const validMinuteValues = [0, 15, 30, 45];

        it.each(validMinuteValues)('validates successfully', async (minutes) => {
            subject.date = new Date(2022, 9, 1, 12, minutes);

            const result = await validate(subject);

            expect(result.length).toBe(0);
        })
    })

    describe("when the date is off the specified interval", () => {
        const invalidMinuteValues = [...Array<number>(60)].map((v, i) => i).filter(v => v % 15);

        it.each(invalidMinuteValues)('returns a validation error', async (minutes) => {
            subject.date = new Date(2022, 9, 1, 12, minutes);

            const result = await validate(subject);

            expect(result.length).toBe(1);
            expect(result[0].constraints.isDateOnInterval).toBe("date must be on an interval of 15 minutes");
        })
    })
})