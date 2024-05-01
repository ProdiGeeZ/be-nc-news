const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());
const controllers = require('./controllers');
app.use(express.json());

app.get("/api", controllers.getDocs);
app.get("/api/topics", controllers.getTopics);
app.get("/api/articles", controllers.getAllArticles);
app.get("/api/users", controllers.getAllUsers)
app.get("/api/users/:username", controllers.getUserById)

app.route("/api/comments/:comment_id")
    .delete(controllers.deleteCommentById)
    .patch(controllers.voteCommentById);

app.route('/api/articles/:article_id')
    .get(controllers.getArticleById)
    .patch(controllers.updateVotes);

app.route('/api/articles/:article_id/comments')
    .get(controllers.getArticleComments)
    .post(controllers.postComment);

app.all("*", controllers.send404);

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.msg || "Internal Server Error";
    if (err.code === '22P02') {
        return res.status(400).send({ msg: "Bad Request: Invalid request format." });
    }
    else if (err.code === '23502') {
        return res.status(400).send({ msg: "Bad Request: invalid request body" });
    }
    else if (err.code === '23503') {
        return res.status(400).send({ msg: `Bad Request: User '${req.body.username}' does not exist.` });
    }
    res.status(status).send({ msg: message });
});

module.exports = app;
