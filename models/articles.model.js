const db = require("../db/connection.js");
const format = require('pg-format');

exports.selectArticleById = (article_id) => {
    const queryString = `SELECT * FROM articles WHERE article_id = $1;`;

    return db.query(queryString, [article_id])
        .then((result) => {
            if (!result.rows[0]) {
                return Promise.reject({ status: 404, msg: "Not Found: article_id does not exist." });
            }
            return result.rows[0];
        })
};

exports.fetchArticles = (topic) => {
    let topicCheck;

    // If topic is provided and is not an empty string, check if it exists
    if (topic) {
        topicCheck = db.query('SELECT * FROM topics WHERE slug = $1', [topic])
            .then((result) => {
                if (!result.rows[0]) {
                    return Promise.reject({ status: 404, msg: `Not Found: topic '${topic}' does not exist.` });
                }
            });
    } else {
        // If no topic is provided or if it's an empty string, skip the check
        topicCheck = Promise.resolve();
    }

    return topicCheck.then(() => {
        let queryString = `
            SELECT
                a.author,
                a.title,
                a.article_id,
                a.topic,
                a.created_at,
                a.votes,
                a.article_img_url,
                (SELECT COUNT(c.comment_id)::int FROM comments c WHERE c.article_id = a.article_id) AS comment_count
            FROM articles a
        `;

        const queryParams = [];

        if (topic) {
            queryString += ` WHERE a.topic = $1`;
            queryParams.push(topic);
        }

        queryString += ` ORDER BY a.created_at DESC`;

        return db.query(queryString, queryParams)
            .then((result) => result.rows);
    });
};




exports.addVotes = (article_id, votesObj) => {
    const {inc_votes} = votesObj
    const queryString = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
    `;
    return db.query(queryString, [inc_votes, article_id])
        .then((result) => {
            return result.rows[0];
        });
}

exports.topicCheck = (topic) => {
    return db.query('SELECT * FROM topics WHERE topic = $1', [topic])
        .then((result) => {
            if (!result.rows[0]) {
                return Promise.reject({ status: 404, msg: `Not Found: topic '${topic}' does not exist.` });
            }
            return topic;
        });
};
