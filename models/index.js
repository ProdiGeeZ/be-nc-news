const { fetchTopics, addNewTopic } = require('./topics.model.js');
const { selectArticleById, fetchArticles, postNewArticle, addVotes, topicCheck } = require('./articles.model.js');
const { fetchArticleComments, addComment, articleCheck, commentCheck, deleteCommentById, patchCommentById } = require('./comments.model.js')
const { fetchUsers, fetchUserById } = require('./users.model.js');

module.exports = {
    fetchTopics,
    addNewTopic,
    fetchArticles,
    postNewArticle,
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