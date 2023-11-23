const { getTopics } = require('./topics.controller.js');
const { getArticleById, getAllArticles } = require('./articles.controller.js');
const { getDocs } = require('./docs.controller.js');
const { send404 } = require('./errors.controller.js');
const { getArticleComments } = require('./comments.controller.js')

module.exports = {
    getTopics,
    getAllArticles,
    getArticleById,
    getDocs,
    send404,
    getArticleComments
};
