const db = require("../db/connection.js");

exports.fetchTopics = () => {
    let queryString = `SELECT * FROM topics`
    return db.query(queryString).then(({rows}) => {
        return rows
    });
}
