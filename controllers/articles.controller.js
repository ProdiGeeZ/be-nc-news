const { selectArticleById, fetchArticles } = require('../models/articles.model.js')

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article});
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
    const articles = fetchArticles()
    return articles
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next);
}