import { AddInventoryRequest } from "./AddInventoryRequest";

describe("AddInventoryRequest", () => {

    let subject: AddInventoryRequest;

    beforeEach(() => {
        subject = new AddInventoryRequest({
            startTime: new Date("2022-10-30T09:00:00.000-04:00"),
            endTime: new Date("2022-10-30T10:00:00.000-04:00"),
            partySize: 4,
            quantity: 10
        })
    })

    describe("toInventories", () => {
        it("creates an inventory for each 15 minutes between startTime and endTime", () => {
            const result = subject.toInventories(2);
            expect(result.length).toBe(4);
            expect(result).toEqual([
                {
                    restaurantId: 2,
                    partySize: subject.partySize,
                    quantity: subject.quantity,
                    time: new Date("2022-10-30T09:00:00.000-04:00")
                },
                {
                    restaurantId: 2,
                    partySize: subject.partySize,
                    quantity: subject.quantity,
                    time: new Date("2022-10-30T09:15:00.000-04:00")
                },
                {
                    restaurantId: 2,
                    partySize: subject.partySize,
                    quantity: subject.quantity,
                    time: new Date("2022-10-30T09:30:00.000-04:00")
                },
                {
                    restaurantId: 2,
                    partySize: subject.partySize,
                    quantity: subject.quantity,
                    time: new Date("2022-10-30T09:45:00.000-04:00")
                }
            ])
        })
    })
})