import {App} from '../App'
import request from 'supertest'

describe('RestaurantController', () => {
    let app: App;
    beforeEach(async () => {
        app = new App();
        await app.bootstrap({seed: true, drop: true});
    })

    describe("GET /restaurants", () => {
        it('returns a paged list of restaurants when the request is valid', async () => {
            const result = await request(app.app)
                .get("/restaurants?offset=1&pageSize=2");
            expect(result.status).toBe(200);
            expect(result.body).toEqual({
                offset: 1,
                pageSize: 2,
                total: 3,
                results: [
                    expect.objectContaining({name: "Paolo's Pasta"}),
                    expect.objectContaining({name: "Sammy's Sandwiches"}),
                ]
            })
        })

        it('returns a 400 when the request is not valid', async () => {
            const result = await request(app.app)
                .get("/restaurants?offset=-1&pageSize=600");

            expect(result.status).toBe(400);
        })
    })

    describe("POST /restaurants", () => {
        it('creates a new restaurant if it is valid', async () => {
            const result = await request(app.app)
                .post("/restaurants")
                .send({name: 'Test Restaurant'});
            expect(result.status).toBe(200);
            expect(result.body).toEqual(expect.objectContaining({
                id: expect.any(Number),
                name: "Test Restaurant"
            }))
        });

        it('returns 400 if restaurant is not valid', async () => {
            const result = await request(app.app)
                .post("/restaurants")
                .send({name: 'b'});
            expect(result.status).toBe(400);
        })
    })
})