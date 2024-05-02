const format = require("pg-format");
const db = require("../db/connection.js");

exports.fetchTopics = () => {
    let queryString = `SELECT * FROM topics`
    return db.query(queryString).then((result) => {
        return result.rows
    });
}

exports.addNewTopic = (requestBody) => {
    const { slug, description } = requestBody;
    const queryString = format(`
    INSERT INTO topics (slug, description)
    VALUES (%L, %L)
    RETURNING *;`, slug, description);
    return db.query(queryString)
        .then((result) => {
            return result.rows[0]
        });
}
