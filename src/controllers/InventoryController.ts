import {ClassOptions, Controller, Get, Post} from "@overnightjs/core";
import {Request, Response} from "express";
import {Inventory} from "../models";
import {AddInventoryRequest, ApiError, PagedRequest, PagedResult} from "../api-models";
import {validate} from "class-validator";
import Logger from "../logger";

@Controller("restaurants/:restaurantId(\\d+)/inventories")
@ClassOptions({mergeParams: true})
export class InventoryController {
    @Get("")
    private async get(req: Request, res: Response) {
        const pagedRequest = new PagedRequest(req);
        const errors = await validate(pagedRequest);
        if (errors.length) {
            res.status(400)
                .send(errors);
            return;
        }
        const totalInventoryRecords = Inventory.count({
            where: {
                restaurantId: req.params.restaurantId
            }
        })
        const inventory = Inventory.findAll({
            where: {
                restaurantId: req.params.restaurantId
            },
            offset: pagedRequest.offset,
            limit: pagedRequest.pageSize,
            order: ["time", "partySize"]
        });

        const result = new PagedResult<Inventory>({
            offset: pagedRequest.offset,
            pageSize: pagedRequest.pageSize,
            total: await totalInventoryRecords,
            results: await inventory
        })

        res.send(result);
    }

    @Post("")
    private async createInventories(req: Request, res: Response) {
        const restaurantId = parseInt(req.params.restaurantId);
        const addInventoryRequest = new AddInventoryRequest(req.body);
        const errors = await validate(addInventoryRequest);
        if (errors.length) {
            res.status(400)
                .send(errors);
            return;
        }
        try {
            const inventories = addInventoryRequest.toInventories(restaurantId);
            await Inventory.bulkCreate(inventories);
            res.sendStatus(201);
        } catch (e) {
            Logger.error("Error creating inventories", e);
            res.status(500)
                .send(new ApiError("Error creating inventories"))
        }
    }
}