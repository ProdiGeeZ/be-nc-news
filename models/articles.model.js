const db = require("../db/connection.js");

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

exports.fetchArticles = () => {
    const queryString = `
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
    ORDER BY a.created_at DESC`;
    return db.query(queryString)
        .then((result) => {
        return result.rows;
    })
}