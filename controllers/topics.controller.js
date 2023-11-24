const models = require("../models/index.js");

exports.getTopics = (req, res, next) => {
    models.fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch(next);
};