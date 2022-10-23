import {Controller, Get} from "@overnightjs/core";
import {Request, Response} from "express";

@Controller("/")
export class TestController {
    @Get("")
    private get(req: Request, res: Response) {
        res.sendStatus(204);
    }
}