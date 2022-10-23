import {Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Inventory} from "./Inventory";
import {Restaurant} from "./Restaurant";

@Table({tableName: "reservations"})
export class Reservation extends Model<Reservation> {
    @PrimaryKey
    @Column({autoIncrement: true})
    id: number

    @ForeignKey(() => Inventory)
    @Column
    inventoryId: number

    @ForeignKey(() => Restaurant)
    @Column
    restaurantId: number

    @Column
    name: string

    @Column
    email: string

    @Column
    partySize: number
}