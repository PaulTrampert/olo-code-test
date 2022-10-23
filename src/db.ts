import {Sequelize} from "sequelize-typescript";
import * as models from "./models";

const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
    dialect: 'postgres',
    logging: process.env.LOG === 'debug' ? console.log : false,
    models: Object.keys(models).map(k => models[k]),
});

const initDb = async () => {
    await sequelize.sync({alter: true});
}

export {sequelize, initDb}