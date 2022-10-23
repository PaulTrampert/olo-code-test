import { Request } from "express";
import { FromQuery } from "./FromQuery";

const parse = jest.fn(value => value);

class TestClass {
    req: Request

    @FromQuery(parse, "default")
    queryValue: string

    constructor(req: Request) {
        this.req = req;
    }
}

describe("FromQuery", () => {
    let fakeRequest: Request;
    let subject: TestClass;

    beforeEach(() => {
        fakeRequest = {} as Request;
        subject = new TestClass(fakeRequest);
    })

    describe('when the request query string contains the decorated property', () => {
        const values = [
            {queryValue: "test"},
            {queryValue: "test1"},
            {queryValue: "test2"}
        ];

        it.each(values)("makes the decorated property get the query value ($queryValue)", ({queryValue}) => {
            fakeRequest.query = {queryValue};

            expect(subject.queryValue).toBe(queryValue);
            expect(parse).toHaveBeenCalledWith(queryValue);
        })
    })

    describe('when the request query string does not contain the decorated property', () => {
        const values = [
            {otherValue: "test"},
            {otherValue: "test1"},
            {otherValue: "test2"}
        ];

        it.each(values)("makes the decorated property get the query value ($otherValue)", ({otherValue}) => {
            fakeRequest.query = {otherValue};

            expect(subject.queryValue).toBe("default");
            expect(parse).toHaveBeenCalledWith(undefined);
        })
    })
})