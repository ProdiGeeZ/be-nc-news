const models = require('../models/index')

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return models.selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article});
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query;
    
    return models.fetchArticles(topic, sort_by, order)
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next);
}

exports.updateVotes = (req, res, next) => {
    const { article_id } = req.params;
    const votesObj = req.body;
    return models.articleCheck(article_id)
    .then((article_id) => {
        return models.addVotes(article_id, votesObj)
    })
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}
