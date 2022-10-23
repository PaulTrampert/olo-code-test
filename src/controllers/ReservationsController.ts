import {ClassOptions, Controller, Get} from "@overnightjs/core";
import {Request, Response} from "express";
import {AvailabilityRequest} from "../api-models/reservations/AvailabilityRequest";
import {sequelize} from "../db";
import {QueryTypes} from "sequelize";
import {Availability} from "../api-models/reservations/Availability";
import {PagedResult} from "../api-models";
import moment from "moment";
import {validate} from "class-validator";

const availabilityQuery = "select * from (select i.id, i.time, sum(i.quantity) - count(r.id) availableReservations from inventories i\n" +
    "left outer join reservations r on r.\"inventoryId\" = i.id\n" +
    "where i.time between :startDate and :endDate\n" +
    "and i.\"partySize\" = :partySize\n" +
    "group by i.id, i.time\n" +
    "order by i.time) as availability\n" +
    "where availableReservations > 0\n" +
    "offset :offset limit :pageSize"
const totalAvailabilityCount = "select count(*) as total from (select i.id, i.time, sum(i.quantity) - count(r.id) availableReservations from inventories i\n" +
    "left outer join reservations r on r.\"inventoryId\" = i.id\n" +
    "where i.time between :startDate and :endDate\n" +
    "and i.\"partySize\" = :partySize\n" +
    "group by i.id, i.time\n" +
    "order by i.time) as availability\n" +
    "where availableReservations > 0"

@Controller("restaurants/:restaurantId/reservations")
@ClassOptions({mergeParams: true})
export class ReservationsController {

    @Get("availability")
    private async getAvailability(req: Request, res: Response) {
        const request = new AvailabilityRequest(req);

        const errors = await validate(request);
        if (errors.length) {
            res.status(400)
                .send(errors);
            return;
        }

        const totalCount = sequelize.query(totalAvailabilityCount, {
            replacements: {
                startDate: request.date.toISOString(),
                endDate: moment(request.date).add(1, 'd').toISOString(),
                partySize: request.partySize
            },
            type: QueryTypes.SELECT,
            plain: true,
            raw: true
        });
        const availability = sequelize.query(availabilityQuery, {
            replacements: {
                startDate: request.date.toISOString(),
                endDate: moment(request.date).add(1, 'd').toISOString(),
                partySize: request.partySize,
                offset: request.offset,
                pageSize: request.pageSize
            },
            type: QueryTypes.SELECT,
        });

        res.send(new PagedResult({
            offset: request.offset,
            pageSize: request.pageSize,
            total: parseInt((await totalCount)['total']),
            results: (await availability).map((a:any) => new Availability({
                inventoryId: a.id,
                time: a.time,
                availableReservations: a.availablereservations
            }))
        }))
    }
}