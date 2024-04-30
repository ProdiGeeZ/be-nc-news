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
    test('400: Should return "Invalid request format" for invalid article_id', () => {
        return request(app)
            .get("/api/articles/invalid_id")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request: Invalid request format.");
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
                expect(response.body.msg).toBe("Bad Request: Invalid request format.")
            });
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    test('201: Should create and post a comment with 2 keys from the request body being username and body, including the other 3 keys', () => {
        const commentData = { username: "butter_bridge", body: "first comment lol." };
        return request(app)
            .post("/api/articles/7/comments")
            .send(commentData)
            .expect(201)
            .then((response) => {
                const comment = response.body.comment
                expect(Object.keys(comment)).toHaveLength(6);
                expect(response.body.comment).toBeDefined();
                expect(response.body.comment.author).toBe(commentData.username);
                expect(response.body.comment.body).toBe(commentData.body);
                expect(comment).toMatchObject({
                    comment_id: 19,
                    body: 'first comment lol.',
                    article_id: 7,
                    author: 'butter_bridge',
                    votes: 0,
                    created_at: expect.any(String),
                })
            })
    });
    test('201: Should create and post a comment even when JSON body has additional keys so long as username and body are included', () => {
        const commentData = { username: "butter_bridge", body: "first comment lol." };
        return request(app)
            .post("/api/articles/7/comments")
            .send(commentData)
            .expect(201)
            .then((response) => {
                const comment = response.body.comment
                expect(Object.keys(comment)).toHaveLength(6);
                expect(response.body.comment).toBeDefined();
                expect(response.body.comment.author).toBe(commentData.username);
                expect(response.body.comment.body).toBe(commentData.body);
                expect(comment).toMatchObject({
                    comment_id: 19,
                    body: 'first comment lol.',
                    article_id: 7,
                    author: 'butter_bridge',
                    votes: 0,
                    created_at: expect.any(String),
                })
            })
    });
    test('400: Should return an error message when the body passed in does not have a valid input', () => {
        const commentData = { name: "butter_bridge", body: "first comment lol." };
        return request(app)
            .post("/api/articles/7/comments")
            .send(commentData)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request: invalid request body")
            });
    });
    test('400: Should return a message when the user sent in the body does not exist.', () => {
        const commentData = { username: "Stuart", body: "first comment lol." };
        return request(app)
            .post("/api/articles/7/comments")
            .send(commentData)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe(`Bad Request: User 'Stuart' does not exist.`)
            });
    });
    test('404: Should return an error with a message when the article_id does not exist.', () => {
        const commentData = { username: "butter_bridge", body: "first comment lol." };
        return request(app)
            .post("/api/articles/90/comments")
            .send(commentData)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe(`Not Found: article_id does not exist.`)
            });
    });
    test('400: Should return an error message when the article_id input is invalid ', () => {
        const commentData = { username: "butter_bridge", body: "first comment lol." };
        return request(app)
            .post("/api/articles/bad_id/comments")
            .send(commentData)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request: Invalid request format.")
            });
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('200: Should update the specified article votes by 1', () => {
        const votesObj = { inc_votes: 1 };
        return request(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(200)
            .then((response) => {
                const article = response.body.article;
                expect(Object.keys(article)).toHaveLength(8);
                expect(article).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: 101,
                    article_img_url: expect.any(String),
                });
            });
    });
    test('200: Should update the specified article votes by 10', () => {
        const votesObj = { inc_votes: 10 };
        return request(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(200)
            .then((response) => {
                const article = response.body.article;
                expect(Object.keys(article)).toHaveLength(8);
                expect(article).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: 110,
                    article_img_url: expect.any(String),
                });
            });
    });
    test('200: Should update with additional keys so long as there is an "inc_votes" key', () => {
        const votesObj = { inc_votes: 1, extraVotes: "100" };
        return request(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(200)
            .then((response) => {
                const article = response.body.article;
                expect(Object.keys(article)).toHaveLength(8);
                expect(article).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: 101,
                    article_img_url: expect.any(String),
                });
            });
    });
    test('200: Should also decrement votes when passed a negative value from JSON object.', () => {
        const votesObj = { inc_votes: -10 };
        return request(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(200)
            .then((response) => {
                const article = response.body.article;
                expect(Object.keys(article)).toHaveLength(8);
                expect(article).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: 90,
                    article_img_url: expect.any(String),
                });
            });
    });
    test('404: Should return an error when the article_id does not exist', () => {
        const votesObj = { inc_votes: 1 };
        return request(app)
            .patch("/api/articles/142")
            .send(votesObj)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Not Found: article_id does not exist.");
            });
    });
    test('400: Should return an error when the request body is invalid', () => {
        const votesObj = { notVotes: "1" };
        return request(app)
            .patch("/api/articles/1")
            .send(votesObj)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request: invalid request body");
            });
    });
    test('400: Should return an error with a message when the article_id is invalid', () => {
        const votesObj = { notVotes: "1" };
        return request(app)
            .patch("/api/articles/bad_id")
            .send(votesObj)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request: Invalid request format.");
            });
    });
});

describe("DELETE /api/comments/:comment_id", () => {
    test('204: responds with no content for the specified comment', () => {
        return request(app)
            .delete("/api/comments/4")
            .expect(204)
            .then((response) => {
                expect(response.body).toEqual({})
                expect(Object.keys(response.body).length).toBe(0)
            })
    })
    test('204: responds with no content for another specified comment', () => {
        return request(app)
            .delete("/api/comments/5")
            .expect(204)
            .then((response) => {
                expect(response.body).toEqual({})
                expect(Object.keys(response.body).length).toBe(0)
            })
    })
    test("DELETE:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
            .delete("/api/comments/99")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Not Found: comment_id does not exist.");
            });
    });
    test("DELETE:400 sends an appropriate status and error message when given an invalid id", () => {
        return request(app)
            .delete("/api/comments/not-a-comment")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad Request: Invalid request format.");
            });
    });
});

describe('GET /api/users', () => {
    test('200: should return an object array of users with the correct keys.', () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then((response) => {
                const users = response.body.users;
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    });
                })
            })
    });
});

describe.only('GET /api/articles?topic=:topic', () => {
    test('200: Should return articles of with the given topic', () => {
        return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then((response) => {
                articles = response.body.articles
                console.log(articles);
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: 'mitch',
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                    });
                })
            })
    });
    test('200: Should return all topics when topic query is not defined.', () => {
        return request(app)
            .get("/api/articles?topic=")
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
    test('404: Should return an error msg when the topic does not exist', () => {
        return request(app)
            .get("/api/articles?topic=coffee")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("Not Found: topic 'coffee' does not exist.");
            })
    });
});