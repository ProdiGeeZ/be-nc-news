const models = require('../models/index');

exports.getAllUsers = (req, res, next) => {
    return models.fetchUsers()
        .then((users) => {
            res.status(200).send({ users })
        })
        .catch(next);
}

exports.getUserById = (req, res, next) => {
    const { username } = req.params;
    return models.fetchUserById(username)
    .then((user) => {
        res.status(200).send({ user })
    }).catch(next);
}
