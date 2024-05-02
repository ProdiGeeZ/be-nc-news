const format = require("pg-format");
const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {
    const queryString = `SELECT 
    a.author,
    a.title,
    a.article_id,
    a.body,
    a.topic,
    a.created_at,
    a.votes,
    a.article_img_url,
    CAST((SELECT COUNT(c.comment_id) FROM comments c WHERE c.article_id = a.article_id) AS INTEGER) AS comment_count
    FROM articles a
    WHERE a.article_id = $1;
    `;

    return db.query(queryString, [article_id])
        .then((result) => {
            if (!result.rows[0]) {
                return Promise.reject({ status: 404, msg: "Not Found: article_id does not exist." });
            }
            return result.rows[0];
        })
};

exports.fetchArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    const validSortColumns = ['author', 'title', 'topic', 'created_at', 'votes'];
    const validOrderColumns = ['asc', 'desc'];

    const checkTopicExists = (topic) => {
        return db.query('SELECT * FROM topics WHERE slug = $1', [topic])
            .then((result) => {
                if (!result.rows.length) {
                    throw { status: 404, msg: `Not Found: topic '${topic}' does not exist.` };
                }
            });
    };

    if (!validSortColumns.includes(sort_by)) {
        throw { status: 400, msg: `Bad Request: invalid sort_by parameter "${sort_by}"` };
    }
    if (!validOrderColumns.includes(order)) {
        throw { status: 400, msg: `Bad Request: order must be "asc" or "desc", got "${order}"` };
    }

    let topicCheck = topic ? checkTopicExists(topic) : Promise.resolve();

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

        queryString += ` ORDER BY a.${sort_by.toLowerCase()} ${order.toLowerCase()}`;

        return db.query(queryString, queryParams)
            .then((result) => result.rows);
    });
};

exports.addVotes = (article_id, votesObj) => {
    const { inc_votes } = votesObj
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

exports.postNewArticle = (requestBody) => {
    const { author, title, body, topic, article_img_url } = requestBody;

    const queryStr = format(`
    WITH new_article AS (
        INSERT INTO articles (title, topic, author, body, article_img_url)
        VALUES (%L, %L, %L, %L, %L)
        RETURNING article_id, title, topic, author, body, article_img_url, created_at, votes
    )
    SELECT 
        a.article_id,
        a.author,
        a.title,
        a.topic,
        a.body,
        a.created_at,
        a.votes,
        a.article_img_url,
        COALESCE(c.comment_count::int, 0) AS comment_count
    FROM new_article a
    LEFT JOIN LATERAL (
        SELECT COUNT(*) AS comment_count
        FROM comments
        WHERE article_id = a.article_id
    ) c ON true;
    `, title, topic, author, body, article_img_url || 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700');

    return db.query(queryStr)
        .then(result => {
            if (result.rows.length > 0) {
                return result.rows[0];  
            } else {
                throw new Error('Insertion failed, no article returned.');
            }
        })
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
