const { fetchTopics, addNewTopic } = require('./topics.model.js');
const { selectArticleById, fetchArticles, postNewArticle, deleteArticleById, addVotes, topicCheck } = require('./articles.model.js');
const { fetchArticleComments, addComment, articleCheck, commentCheck, deleteCommentById, patchCommentById } = require('./comments.model.js')
const { fetchUsers, fetchUserById } = require('./users.model.js');

module.exports = {
    fetchTopics,
    addNewTopic,
    fetchArticles,
    postNewArticle,
    deleteArticleById,
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