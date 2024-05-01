const db = require("../db/connection.js");

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users;')
        .then((users) => {
            return users.rows;
        })
}

exports.fetchUserById = (username) => {
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        throw { status: 400, msg: 'Bad Request: Invalid or missing username' };
    }
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(result => {
        if (result.rows.length === 0) {
            throw { status: 404, msg: 'User not found' };
        }
        return result.rows[0];
    });
}


