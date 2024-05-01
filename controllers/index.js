const { getTopics } = require('./topics.controller.js');
const { getArticleById, getAllArticles, updateVotes } = require('./articles.controller.js');
const { getDocs } = require('./docs.controller.js');
const { send404 } = require('./errors.controller.js');
const { getArticleComments, postComment, deleteCommentById } = require('./comments.controller.js')
const { getAllUsers, getUserById } = require('./users.controllers.js')

module.exports = {
    getTopics,
    getAllArticles,
    getArticleById,
    getDocs,
    send404,
    getArticleComments,
    postComment,
    updateVotes,
    deleteCommentById,
    getAllUsers,
    getUserById
};
