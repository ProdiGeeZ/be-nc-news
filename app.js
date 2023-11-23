const express = require("express");
const app = express();
const controllers = require('./controllers');

app.get("/api/topics", controllers.getTopics);
app.get("/api/articles", controllers.getAllArticles);
app.get("/api/articles/:article_id", controllers.getArticleById);
app.get('/api/articles/:article_id/comments', controllers.getArticleComments);
app.post('/api/articles/:article_id/comments', controllers.postComment);
app.get("/api", controllers.getDocs);
app.all("*", controllers.send404);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.msg || "Internal Server Error";
    if(err.code === '22P02'){
        res.status(400).send({msg: "Bad Request: Invalid article_id format"});
    }
    res.status(status).send({ msg: message });
});

module.exports = app;