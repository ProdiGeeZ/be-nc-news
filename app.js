const express = require("express");
const app = express();
const controllers = require('./controllers');
app.use(express.json());

app.get("/api/topics", controllers.getTopics);
app.get("/api/articles", controllers.getAllArticles);
app.get("/api/articles/:article_id", controllers.getArticleById);
app.get('/api/articles/:article_id/comments', controllers.getArticleComments);
app.post("/api/articles/:article_id/comments", controllers.postComment);
app.patch("/api/articles/:article_id", controllers.updateVotes)
app.delete("/api/comments/:comment_id", controllers.deleteCommentById)
app.get("/api/users", controllers.getAllUsers)
app.get("/api", controllers.getDocs);
app.all("*", controllers.send404);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.msg || "Internal Server Error";
    if(err.code === '22P02'){
        return res.status(400).send({msg: "Bad Request: Invalid request format."});
    }
    else if (err.code === '23502') {
        return res.status(400).send({msg: "Bad Request: invalid request body"})
    }
    else if (err.code === '23503') {
        return res.status(400).send({msg: `Bad Request: User '${req.body.username}' does not exist.`})
    }
    res.status(status).send({ msg: message });
});

module.exports = app;