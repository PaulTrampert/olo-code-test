import express from 'express';
import {initDb} from "./db";
import {Server} from "@overnightjs/core";
import * as controllers from './controllers/index'
import Logger from './logger'
import bodyParser from "body-parser";
import isISODate from 'is-iso-date';

export class App extends Server {

    constructor() {
        super();
        this.app.use(bodyParser.json({
            reviver: (key, value) => {
                if (typeof(value) === "string" && isISODate(value))
                {
                    return new Date(value);
                }
                return value;
            }
        }));
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.bootstrap();
    }

    public start(): void {
        const port = process.env.PORT || 8080;

        this.app.listen(port, () => {
            console.log("Server listening on port: " + port);
        });
    }

    private async bootstrap() {
        await initDb();

        const ctrlInstances = [];
        for (const ctrlName in controllers) {
            if (controllers.hasOwnProperty(ctrlName)) {
                const controller = new controllers[ctrlName]();
                ctrlInstances.push(controller);
            } else {
                Logger.error(`${ctrlName} does not exist`);
            }
        }
        super.addControllers(ctrlInstances);
    }
}