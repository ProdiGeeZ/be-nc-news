const db = require("../db/connection.js");
const format = require('pg-format');

exports.fetchArticleComments = (article_id, limit = 10, page = 1) => {
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
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3;
            `;

            const offset = (page - 1) * limit;

            return db.query(queryString, [article_id, limit, offset]);
        })
        .then((result) => {
            return result.rows;
        });
};

exports.addComment = (article_id, commentData) => {
    const queryString = format(
        'INSERT INTO comments (body, article_id, author, votes, created_at) VALUES (%L, %L, %L, %L, %L) RETURNING *;',
        commentData.body,
        article_id,
        commentData.username,
        0,
        new Date(),
    );
    return db.query(queryString)
        .then((result) => {
            return result.rows[0];
        });
};

exports.articleCheck = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
        .then((result) => {
            if (!result.rows[0]) {
                return Promise.reject({ status: 404, msg: `Not Found: article_id does not exist.` });
            }
            return article_id;
        })
}

exports.deleteCommentById = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1', [comment_id])
        .then((deletedComment) => {
            return deletedComment.rows;
        })
}

exports.patchCommentById = (comment_id, votesObj) => {
    const { inc_votes } = votesObj;
    const queryString = `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;
    `;

    return db.query(queryString, [inc_votes, comment_id])
        .then((result) => {
            return result.rows[0];
        });
}

exports.commentCheck = (comment_id) => {
    return db.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
        .then(result => {
            if (!result.rows[0]) {
                return Promise.reject({ status: 404, msg: "Not Found: comment_id does not exist." });
            }
            return comment_id
        })
}
