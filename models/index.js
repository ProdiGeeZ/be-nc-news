const { fetchTopics } = require('./topics.model.js');
const { selectArticleById, fetchArticles, addVotes } = require('./articles.model.js');
const { fetchArticleComments, addComment, articleCheck, commentCheck,deleteCommentById } = require('./comments.model.js')

module.exports = {
    fetchTopics,
    fetchArticles,
    selectArticleById,
    fetchArticleComments,
    articleCheck,
    addComment,
    addVotes,
    commentCheck,
    deleteCommentById
};