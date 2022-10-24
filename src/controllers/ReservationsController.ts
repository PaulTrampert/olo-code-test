import {ClassOptions, Controller, Get, Post} from "@overnightjs/core";
import {Request, Response} from "express";
import {AvailabilityRequest} from "../api-models/reservations/AvailabilityRequest";
import {sequelize} from "../db";
import {QueryTypes} from "sequelize";
import {Availability} from "../api-models/reservations/Availability";
import {ApiError, PagedResult} from "../api-models";
import moment from "moment";
import {validate} from "class-validator";
import {ReservationRequest} from "../api-models/reservations/ReservationRequest";
import {Reservation} from "../models";

const availabilityQuery = "select * from (select i.time, i.quantity - count(r.id) availableReservations from inventories i\n" +
    "left outer join reservations r on r.\"inventoryId\" = i.id\n" +
    "where i.time between :startDate and :endDate\n" +
    "and i.\"partySize\" = :partySize\n" +
    "and i.\"restaurantId\" = :restaurantId\n" +
    "group by i.time, i.quantity\n" +
    "order by i.time) as availability\n" +
    "where availableReservations > 0\n" +
    "offset :offset limit :pageSize"
const totalAvailabilityCount = "select count(*) as total from (select i.time, i.quantity - count(r.id) availableReservations from inventories i\n" +
    "left outer join reservations r on r.\"inventoryId\" = i.id\n" +
    "where i.time between :startDate and :endDate\n" +
    "and i.\"partySize\" = :partySize\n" +
    "and i.\"restaurantId\" = :restaurantId\n" +
    "group by i.time, i.quantity\n" +
    "order by i.time) as availability\n" +
    "where availableReservations > 0"

@Controller("restaurants/:restaurantId(\\d+)/reservations")
@ClassOptions({mergeParams: true})
export class ReservationsController {

    @Post("")
    private async reserve(req: Request, res: Response) {
        let restaurantId = parseInt(req.params.restaurantId);
        const request = new ReservationRequest(restaurantId, req.body);
        const t = await sequelize.transaction();
        try {
            const inventory = await sequelize.query("select * from (select i.id, i.quantity - count(r.id) availableReservations from inventories i\n" +
                "left outer join reservations r on r.\"inventoryId\" = i.id\n" +
                "where i.time = :time\n" +
                "and i.\"partySize\" = :partySize\n" +
                "and i.\"restaurantId\" = :restaurantId\n" +
                "group by i.id, i.quantity\n" +
                "order by i.id) as availability\n" +
                "where availableReservations > 0\n" +
                "limit 1",
                {
                    replacements: {
                        time: request.time,
                        partySize: request.partySize,
                        restaurantId: request.restaurantId
                    },
                    type: QueryTypes.SELECT,
                    plain: true
                }
            );
            if (!inventory) {
                res.status(400)
                    .send(new ApiError("There are no available reservations your requested time. Please try another."));
                await t.rollback();
                return;
            }

            const result = await Reservation.create({
                inventoryId: parseInt(inventory['id']),
                name: request.name,
                email: request.email,
                partySize: request.partySize,
                restaurantId
            });
            await t.commit();
            res.send(result);
        } catch (e) {
            await t.rollback();
        }
    }

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
                partySize: request.partySize,
                restaurantId: request.restaurantId
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
                pageSize: request.pageSize,
                restaurantId: request.restaurantId
            },
            type: QueryTypes.SELECT,
        });

        res.send(new PagedResult({
            offset: request.offset,
            pageSize: request.pageSize,
            total: parseInt((await totalCount)['total']),
            results: (await availability).map((a:any) => new Availability({
                time: a.time,
                availableReservations: parseInt(a.availablereservations)
            }))
        }))
    }
}