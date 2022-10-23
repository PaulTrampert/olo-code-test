export class Availability {
    inventoryId: number
    time: Date
    availableReservations: number

    constructor(init?: Partial<Availability>) {
        Object.assign(this, init);
    }
}