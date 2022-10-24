import {App} from '../App'
import request from 'supertest'
import { Inventory, Reservation, Restaurant } from '../models';
import { AddInventoryRequest, ReservationRequest } from '../api-models';

describe('InventoryController', () => {
    let app: App;
    let restaurant: Restaurant;
    beforeEach(async () => {
        app = new App();
        await app.bootstrap({seed: true, drop: true});

        restaurant = await Restaurant.findOne({
            where: {
                name: "Bob's Burgers"
            }
        });
        if (!restaurant) {
            fail("Expected restaurant was not found.");
        }

        // fill all but one 9AM slot
        const inventory = (await Inventory.findAll({
            where: {
                restaurantId: restaurant.id,
                time: new Date("2022-10-30T09:00:00.000-04:00")
            }
        }))[0];

        if(!inventory) {
            fail("Expected inventory was not found");
        }

        await Reservation.bulkCreate([...Array(19)].map((v, idx): Reservation => ({
            restaurantId: restaurant.id,
            name: `Test ${idx}`,
            email: `test${idx}@test.com`,
            partySize: 2,
            inventoryId: inventory.id,
        } as Reservation)))
    })

    describe("GET /restaurants/:restaurantId/reservations/availability", () => {
        it('gets the availability for the specified date and partySize', async () => {
            const result = await request(app.app)
                .get(`/restaurants/${restaurant.id}/reservations/availability?date=2022-10-30T00:00:00.000-04:00&partySize=2`);
            expect(result.status).toBe(200);
            expect(result.body).toEqual(expect.objectContaining({
                offset: 0,
                pageSize: 50,
                total: 32,
                results: expect.any(Array)
            }))
            expect(result.body.results.filter(r => r.time === "2022-10-30T13:00:00.000Z")[0].availableReservations).toBe(1);
        })
    })

    describe("POST /restaurants/:restaurantId/reservations", () => {

        it('creates the reservation if there is inventory for the party size at the specified time', async () => {
            const result = await request(app.app)
                .post(`/restaurants/${restaurant.id}/reservations`)
                .send(new ReservationRequest(restaurant.id, {
                    name: "Test",
                    email: "test@test.com",
                    partySize: 2,
                    time: new Date("2022-10-30T09:00:00.000-04:00")
                }));
            expect(result.status).toBe(200);
            expect(result.body).toEqual(expect.objectContaining({
                restaurantId: restaurant.id,
                name: "Test",
                email: "test@test.com",
                partySize: 2,
            }))
            
            const reservation = await Reservation.findOne({
                where: {
                    id: result.body.id
                }
            });

            expect(reservation).toBeDefined();
        })

        it('returns 400 if there is no inventory for the requested reservation', async () => {
            let result = await request(app.app)
                .post(`/restaurants/${restaurant.id}/reservations`)
                .send(new ReservationRequest(restaurant.id, {
                    name: "Test",
                    email: "test@test.com",
                    partySize: 2,
                    time: new Date("2022-10-30T09:00:00.000-04:00")
                }));
            expect(result.status).toBe(200);
            expect(result.body).toEqual(expect.objectContaining({
                restaurantId: restaurant.id,
                name: "Test",
                email: "test@test.com",
                partySize: 2,
            }))

            result = await request(app.app)
                .post(`/restaurants/${restaurant.id}/reservations`)
                .send(new ReservationRequest(restaurant.id, {
                    name: "Test2",
                    email: "test2@test.com",
                    partySize: 2,
                    time: new Date("2022-10-30T09:00:00.000-04:00")
                }));
            expect(result.status).toBe(400);
        })
    })
})