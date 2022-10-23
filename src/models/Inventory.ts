import {Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Restaurant} from "./Restaurant";

@Table({tableName: "inventories"})
export class Inventory extends Model<Inventory> {
    @PrimaryKey
    @Column({autoIncrement: true})
    id: number

    @ForeignKey(() => Restaurant)
    @Column
    restaurantId: number

    @Column
    time: Date

    @Column
    partySize: number

    @Column
    quantity: number
}