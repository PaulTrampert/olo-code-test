import { Request } from "express";
import { FromPath } from "./FromPath";

const parse = jest.fn(value => value);

class TestClass {
    req: Request

    @FromPath(parse)
    pathValue: string

    constructor(req: Request) {
        this.req = req;
    }
}

describe("FromPath", () => {
    let fakeRequest: Request;
    let subject: TestClass;

    beforeEach(() => {
        fakeRequest = {} as Request;
        subject = new TestClass(fakeRequest);
    })

    describe('when the request path string contains the decorated property', () => {
        const values = [
            {pathValue: "test"},
            {pathValue: "test1"},
            {pathValue: "test2"}
        ];

        it.each(values)("makes the decorated property get the path value ($pathValue)", ({pathValue}) => {
            fakeRequest.params = {pathValue};

            expect(subject.pathValue).toBe(pathValue);
            expect(parse).toHaveBeenCalledWith(pathValue);
        })
    })

    describe('when the request path string does not contain the decorated property', () => {
        const values = [
            {otherValue: "test"},
            {otherValue: "test1"},
            {otherValue: "test2"}
        ];

        it.each(values)("makes the decorated property get the path value ($otherValue)", ({otherValue}) => {
            fakeRequest.params = {otherValue};

            expect(subject.pathValue).toBe(undefined);
            expect(parse).toHaveBeenCalledWith(undefined);
        })
    })
})