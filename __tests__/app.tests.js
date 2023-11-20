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

describe("GET /api/nonexistentendpoint", () => {
    test("404: Responds with an error when endpoint path does not exist", () => {
        return request(app)
            .get("/api/nonexistentendpoint")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Path not found");
            });
    });
});

describe("GET /api/topics", () => {
    test("200: Should return with an array of topic objects, with slug and description properties", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                const topics = body.topics;
                expect(topics).toHaveLength(3);
                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String),
                    });
                });
            });
    });
});