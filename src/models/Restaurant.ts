import {Column, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table({tableName: 'Restaurants'})
export class Restaurant extends Model<Restaurant> {

    @PrimaryKey
    @Column({autoIncrement: true})
    id: number

    @Column
    name: string

}