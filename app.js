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
    console.log(err);
    const status = err.status || 500;
    const message = err.msg || "Internal Server Error";
    if(err.code === '22P02'){
        res.status(400).send({msg: "Bad Request: Invalid article_id format"});
    }
    res.status(status).send({ msg: message });
});


module.exports = app;
