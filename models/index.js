const { fetchTopics } = require('./topics.model.js');
const { selectArticleById, fetchArticles, addVotes, topicCheck } = require('./articles.model.js');
const { fetchArticleComments, addComment, articleCheck, commentCheck, deleteCommentById, patchCommentById } = require('./comments.model.js')
const { fetchUsers, fetchUserById } = require('./users.model.js');

module.exports = {
    fetchTopics,
    fetchArticles,
    selectArticleById,
    fetchArticleComments,
    articleCheck,
    addComment,
    addVotes,
    commentCheck,
    deleteCommentById,
    fetchUsers,
    topicCheck,
    fetchUserById,
    patchCommentById
};