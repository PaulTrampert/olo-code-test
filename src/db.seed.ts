import { AddInventoryRequest } from './api-models';
import {
    Restaurant,
    Inventory,
    Reservation
} from './models'


export const seed = async (drop: boolean) => {
    const isSeeded = (await Restaurant.findAll()).length > 0;
    if (isSeeded && !drop)
        return;
    if (drop){
        Restaurant.truncate();
        Inventory.truncate();
        Reservation.truncate();
    }
    let restaurants = [
        {
            name: "Bob's Burgers"
        },
        {
            name: "Sammy's Sandwiches"
        },
        {
            name: "Paolo's Pasta"
        }
    ] as Restaurant[];

    let inventories = {
        "Bob's Burgers": [
            new AddInventoryRequest({
                startTime: new Date("2022-10-30T09:00:00.000-04:00"),
                endTime: new Date("2022-10-30T17:00:00.000-04:00"),
                partySize: 2,
                quantity: 20
            }),
            new AddInventoryRequest({
                startTime: new Date("2022-10-30T17:00:00.000-04:00"),
                endTime: new Date("2022-10-31T00:00:00.000-04:00"),
                partySize: 4,
                quantity: 10
            }),
        ],
    }

    restaurants = await Restaurant.bulkCreate(restaurants);

    for (const restaurant of restaurants) {
        if (inventories[restaurant.name]) {
            await Inventory.bulkCreate(inventories[restaurant.name]
                .map((i: AddInventoryRequest) => i.toInventories(restaurant.id))
                .flat()
            );
        }
    }   
}