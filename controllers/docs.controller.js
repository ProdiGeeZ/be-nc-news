const endpoints = require('../endpoints.json')

exports.getDocs = (req, res, next) => {
    res.status(200).send({ endpoints });
};