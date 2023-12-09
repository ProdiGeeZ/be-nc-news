const { fetchTopics } = require('./topics.model.js');
const { selectArticleById, fetchArticles, addVotes, topicCheck } = require('./articles.model.js');
const { fetchArticleComments, addComment, articleCheck, commentCheck, deleteCommentById } = require('./comments.model.js')
const { fetchUsers } = require('./users.model.js');

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
    topicCheck
};