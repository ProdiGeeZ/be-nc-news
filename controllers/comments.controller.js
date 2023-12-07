const models = require('../models/index.js');

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    models.fetchArticleComments(article_id)
        .then(comments => {
            res.status(200).send({ comments });
        })
        .catch(next);
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const commentData = req.body;
    return models.articleCheck(article_id)
        .then((article_id) => {
            return models.addComment(article_id, commentData)
        })
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    return models.commentCheck(comment_id)
        .then((comment_id) => {
            return models.deleteCommentById(comment_id)
        })
        .then((deletedComment) => {
            res.status(204).send({ deletedComment })
        })
        .catch(next);
}