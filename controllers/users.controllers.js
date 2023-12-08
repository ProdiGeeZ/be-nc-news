const models = require('../models/index')

exports.getAllUsers = (req, res, next) => {
    return models.fetchUsers()
        .then((users) => {
        console.log(users);
        res.status(200).send({users})
    }).catch(next) 
}