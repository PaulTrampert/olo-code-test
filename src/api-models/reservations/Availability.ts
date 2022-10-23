export class Availability {
    time: Date
    availableReservations: number

    constructor(init?: Partial<Availability>) {
        Object.assign(this, init);
    }
}