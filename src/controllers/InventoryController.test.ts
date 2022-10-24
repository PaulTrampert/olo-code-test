import {App} from '../App'
import request from 'supertest'
import { Inventory, Restaurant } from '../models';
import { AddInventoryRequest } from '../api-models';

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
    })

    describe('GET /restaurants/:restaurantId/inventories', () => {
        it('gets a paginated list of inventories', async () => {
            const result = await request(app.app)
                .get(`/restaurants/${restaurant.id}/inventories`);

            expect(result.status).toBe(200);
            expect(result.body).toEqual(expect.objectContaining({
                offset: 0,
                pageSize: 50,
                total: 60,
                results: expect.any(Array)
            }))
        })

        it('returns 400 if the request is invalid', async () => {
            const result = await request(app.app)
                .get(`/restaurants/${restaurant.id}/inventories?pageSize=600`);

            expect(result.status).toBe(400);
        })
    })

    describe("POST /restaurants/:restaurantId/inventories", () => {
        beforeEach(async () => {
            restaurant = await Restaurant.findOne({
                where: {
                    name: "Sammy's Sandwiches"
                }
            });
            if (!restaurant) {
                fail("Expected restaurant was not found.");
            }   
        })

        it("creates inventory over the time span for the specified restaurant", async () => {
            const result = await request(app.app)
                .post(`/restaurants/${restaurant.id}/inventories`)
                .send(new AddInventoryRequest({
                    startTime: new Date("2022-10-30T09:00:00.000-04:00"),
                    endTime: new Date("2022-10-30T10:00:00.000-04:00"),
                    partySize: 4,
                    quantity:10
                }));
            expect(result.status).toBe(201);

            const inventories = await Inventory.findAll({
                where: {
                    restaurantId: restaurant.id
                }
            });

            expect(inventories.length).toBe(4);
        })
    })
})