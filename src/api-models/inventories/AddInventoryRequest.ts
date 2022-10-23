import {IsDate, IsInt, Min} from "class-validator";
import {IsDateOnInterval} from "../../validators";
import moment from 'moment';
import {IsDateLaterThan} from "../../validators/IsDateLaterThan";

export class AddInventoryRequest {

    constructor(init?: Partial<AddInventoryRequest>) {
        Object.assign(this, init);
    }

    @IsDate()
    @IsDateOnInterval(15)
    startTime: Date

    @IsDate()
    @IsDateOnInterval(15)
    @IsDateLaterThan('startTime')
    endTime: Date

    @IsInt()
    @Min(1)
    partySize: number

    @IsInt()
    @Min(1)
    quantity: number

    toInventories = (restaurantId: number): any[] => {
        const inventories = [];
        let nextTime = this.startTime;
        while (nextTime.getTime() < this.endTime.getTime()) {
            inventories.push({
                restaurantId,
                partySize: this.partySize,
                quantity: this.quantity,
                time: nextTime
            });
            nextTime = moment(nextTime).add(15, "m").toDate();
        }
        return inventories;
    }
}