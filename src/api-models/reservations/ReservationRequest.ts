export class ReservationRequest {
    restaurantId: number
    time: Date
    name: string
    email: string
    partySize: number

    constructor(restaurantId: number, init?: Partial<ReservationRequest>) {
        Object.assign(this, init);
    }
}