import {IsDateLaterThan} from "./IsDateLaterThan";
import {validate} from "class-validator";

class TestClass {
    date1: Date

    @IsDateLaterThan('date1')
    date2: Date

    constructor(init?: Partial<TestClass>) {
        Object.assign(this, init);
    }
}

describe('IsDateLaterThan', () => {
    let subject: TestClass;

    beforeEach(() => {
        subject = new TestClass();
    })

    describe('when target prop is later than other prop', () => {
        beforeEach(() => {
            subject.date1 = new Date("2022-10-01");
            subject.date2 = new Date("2022-10-02");
        })

        it('validates successfully', async () => {
            const result = await validate(subject);
            expect(result.length).toBe(0);
        });
    })

    describe('when target prop is earlier than other prop', () => {
        beforeEach(() => {
            subject.date1 = new Date("2022-10-01");
            subject.date2 = new Date("2022-09-02");
        })

        it('gives a validation error', async () => {
            const result = await validate(subject);
            expect(result.length).toBe(1);
            expect(result[0].constraints.isDateLaterThan).toBe("date2 must be later than date1")
        });
    })
})