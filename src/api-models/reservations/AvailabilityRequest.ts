import {PagedRequest} from "../PagedRequest";
import {FromQuery, parseDate} from "../../request-parsing";
import {Request} from "express";

export class AvailabilityRequest extends PagedRequest {
    @FromQuery(parseDate, new Date())
    date: Date

    @FromQuery(parseInt, 4)
    partySize: number

    constructor(req: Request) {
        super(req);
    }
}