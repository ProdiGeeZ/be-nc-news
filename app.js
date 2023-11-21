const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller.js");
const { getArticleById } = require("./controllers/articles.controller.js");
const { getDocs } = require("./controllers/docs.controller.js");
const { send404 } = require("./controllers/errors.controller.js");


app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api", getDocs);


app.all("*", send404);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.msg || "Internal Server Error";
    res.status(status).send({ msg: message });
});


module.exports = app;
