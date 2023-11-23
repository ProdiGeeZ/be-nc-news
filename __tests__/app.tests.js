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
            });
    });
});

describe('GET /api/articles/:article_id', () => {
    test('200: Should return an article object with the correct keys', () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then((response) => {
                const { article } = response.body;
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: 1,
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                });
            });
    });
    test("404: Should return an error when the requested article_id does not exist", () => {
        return request(app)
            .get("/api/articles/9000")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Not Found: article_id does not exist.");
            });
    });
    test('400: Should return "Invalid article_id format" for invalid article_id', () => {
        return request(app)
            .get("/api/articles/invalid_id")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request: Invalid article_id format");
            });
    });
});

describe('GET /api/articles', () => {
    test('200: Should return an array containing all article objects with correct keys', () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                expect(articles).toHaveLength(13);
                articles.forEach(article => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number),
                    });
                });
            });
    });
    test('200: Should return the array sorted by created_at key descending.', () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                expect(articles).toHaveLength(13);
                expect(articles).toBeSorted('created_at', { descending: true })
            });
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    test('200: Should return an array of comments associated with the given article_id', () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((response) => {
                const comments = response.body.comments;
                expect(comments).toHaveLength(11);
                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: 1,
                    });
                })
            });
    });
    test('200: Should return comments sorted by created_at key order descending', () => {
        return request(app)
        .get("/api/articles/1/comments")
            .expect(200)
            .then((response) => {
                const comments = response.body.comments;
                expect(comments).toHaveLength(11);
                expect(comments).toBeSorted('created_at', { descending: true })
            });
    });
    test('200: Should return a message when there are no articles found for an existing article_id', () => {
        return request(app)
        .get("/api/articles/7/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.msg).toBe("No comments found for this article_id")
            });
    });
    test('404: Should return an error with a message when article_id does not exist.', () => {
        return request(app)
        .get("/api/articles/9000/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Not Found: article_id does not exist.")
            });
    });
    test('400: Should return an error with a message when the article_id is invalid', () => {
        return request(app)
        .get("/api/articles/bad_id/comments")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request: Invalid article_id format")
            });
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    test('201: should post a commentand return it with the correct keys and values', () => {
        return request(app)
        .post("/api/articles/1/comments")
        .expect(201)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request: Invalid article_id format")
        });
    });
});