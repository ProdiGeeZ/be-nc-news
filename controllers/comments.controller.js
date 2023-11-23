const { fetchArticleComments } = require('../models/comments.model');

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleComments(article_id)
        .then(comments => {
            res.status(200).send({comments});
        })
        .catch(next);
};