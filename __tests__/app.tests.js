const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const endpoints = require('../endpoints.json')

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

describe('GET /api', () => {
    test('200: should return a json object', () => {
        return request(app)
            .get("/api")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(({ body }) => {
                const docs = body.endpoints;
                expect(docs).toBeInstanceOf(Object);
                expect(docs).toEqual(endpoints)
                console.log(docs);
            });
    });
    
});