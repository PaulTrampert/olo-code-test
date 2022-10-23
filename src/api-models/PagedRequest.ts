import {FromQuery} from "../request-parsing";
import {Request} from "express";
import {Max, Min} from "class-validator";

export class PagedRequest {

    constructor(req: Request) {
        Object.defineProperty(this, 'req', {
            enumerable: false,
            value: req
        })
    }

    @FromQuery(parseInt, 0)
    @Min(0)
    offset: number

    @FromQuery(parseInt, 50)
    @Min(1)
    @Max(500)
    pageSize: number
}