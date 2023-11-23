const {
    fetchArticleComments,
    addComment,
    articleCheck
} = require('../models/comments.model');

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleComments(article_id)
        .then(comments => {
            res.status(200).send({ comments });
        })
        .catch(next);
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const commentData = req.body;
    return articleCheck(article_id)
        .then((article_id) => {
            return addComment(article_id, commentData)
        })
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};
