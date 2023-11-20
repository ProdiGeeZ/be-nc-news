const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
});

describe('Invalid endpoints', () => {
    test("404: Responds with an error for endpoints that do not exist", () => {
        return request(app)
            .get("/notavalidendpoint")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Path not found");
            });
    });
});