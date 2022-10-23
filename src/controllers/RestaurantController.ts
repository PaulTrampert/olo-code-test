import {Get, Controller, Post} from "@overnightjs/core";
import {Request, Response} from 'express';
import {Restaurant} from "../models";
import {CreateRestaurantRequest, PagedRequest, PagedResult} from "../api-models";
import {validate} from "class-validator";

@Controller("restaurants")
export class RestaurantController {
    @Get("")
    private async list(req: Request, res: Response) {
        const request = new PagedRequest(req);
        const errors = await validate(request);
        if (errors.some(() => true)) {
            res.status(400)
                .send(errors);
            return;
        }
        const total = Restaurant.count();
        const page = Restaurant.findAll({
            offset: request.offset,
            limit: request.pageSize,
            order: ['name']
        });
        const result = new PagedResult<Restaurant>({
            offset: request.offset,
            pageSize: request.pageSize,
            total: await total,
            results: await page
        }) ;

        res.send(result);
    }

    @Post("")
    private async create(req: Request, res: Response) {
        const createRestaurantRequest = new CreateRestaurantRequest(req.body);
        const errors = await validate(createRestaurantRequest);
        if (errors.some(() => true)) {
            res.status(400)
                .send(errors);
        }
        const result = await Restaurant.create({
            name: req.body.name
        });

        if (result.id > 0) {
            res.send(result);
        }
        else {
            res.status(500).send({
                message: "There was an error creating the restaurant"
            });
        }
    }
}