import {Sequelize} from "sequelize-typescript";
import * as models from "./models";
import {seed as seedDb} from './db.seed'

const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
    dialect: 'postgres',
    logging: process.env.LOG === 'debug' ? console.log : false,
    models: Object.keys(models).map(k => models[k]),
});

const initDb = async ({seed = true, drop = false} = {}) => {
    await sequelize.sync({alter: true});
    if (seed) {
        await seedDb(drop);
    }
}

export {sequelize, initDb}