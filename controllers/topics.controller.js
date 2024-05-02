const models = require("../models/index.js");

exports.getTopics = (req, res, next) => {
    models.fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch(next);
};

exports.postTopic = (req, res, next) => {
    const requestBody = req.body;
    models.addNewTopic(requestBody)
        .then((topic) => {
            res.status(201).send({ topic });
        })
        .catch(next);
};