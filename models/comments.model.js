const db = require("../db/connection.js");

exports.fetchArticleComments = (article_id) => {
    const queryString = `
        SELECT
            comment_id,
            votes,
            created_at,
            author,
            body,
            article_id
        FROM comments WHERE article_id = $1
        ORDER BY created_at DESC;
    `;
    return db.query(queryString, [article_id])
        .then((result) => {
            console.log(result.article_id);
            if (!result.rows[0]) {
                return Promise.reject({ status: 404, msg: "Not Found: article_id does not exist or there are no comments associated with that article_id" });
            }
            return result.rows;       
        });
};

