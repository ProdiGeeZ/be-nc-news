const models = require('../models/index')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return models.selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};

exports.getAllArticles = (req, res, next) => {
    const { topic, sort_by, order, limit, page } = req.query;

    return models.fetchArticles(topic, sort_by, order, limit, page)
        .then(({ articles, total_count }) => {
            res.status(200).send({
                articles: articles,
                total_count: total_count
            });
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
            res.status(200).send({ article })
        })
        .catch(next)
}

exports.postArticle = (req, res, next) => {
    const requestBody = req.body;
    return models.postNewArticle(requestBody)
        .then((article) => {
            res.status(201).send({ article });
        })
        .catch(next);
}

exports.deleteArticle = (req, res, next) => {
    const { article_id } = req.params;
    return models.articleCheck(article_id)
        .then((article_id) => {
            return models.deleteArticleById(article_id)
        })
        .then((deletedArticle) => {
            res.status(204).send({ deletedArticle });
        })
        .catch(next);
}

