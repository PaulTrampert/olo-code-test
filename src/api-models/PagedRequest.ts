import {FromQuery} from "../request-parsing";
import {Request} from "express";
import {Max, Min} from "class-validator";

export class PagedRequest {

    req: Request

    constructor(req: Request) {
        this.req = req;
    }

    @FromQuery(parseInt, 0)
    @Min(0)
    offset: number

    @FromQuery(parseInt, 50)
    @Min(1)
    @Max(500)
    pageSize: number
}