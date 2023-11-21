const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {
    if (!/-?\d+$/.test(article_id)) {
        return Promise.reject({ status: 400, msg: "Bad Request: Invalid article_id format" });
    }

    const queryString = `SELECT * FROM articles WHERE article_id = $1;`;

    return db.query(queryString, [article_id])
        .then((result) => {
            if (!result.rows[0]) {
                return Promise.reject({ status: 404, msg: "Not Found: article_id does not exist." });
            }
            return result.rows[0];
        });
};
