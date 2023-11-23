const db = require("../db/connection.js");

exports.fetchArticleComments = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
        .then(articleResult => {
            if (!articleResult.rows[0]) {
                return Promise.reject({ status: 404, msg: "Not Found: article_id does not exist." });
            }
            const queryString = `
                SELECT
                    comment_id,
                    votes,
                    created_at,
                    author,
                    body,
                    article_id
                FROM comments
                WHERE article_id = $1
                ORDER BY created_at DESC;
            `;
            return db.query(queryString, [article_id]);
        })
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 200, msg: "No comments found for this article_id" });
            }
            return result.rows;
        });
};



