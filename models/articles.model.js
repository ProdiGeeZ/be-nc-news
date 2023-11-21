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
