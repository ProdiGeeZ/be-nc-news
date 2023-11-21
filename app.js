const express = require("express");
const app = express();
app.use(express.json());

const {getTopics} = require("./controllers/topics.controller.js");
const { send404 } = require("./controllers/errors.controller.js");
const { getDocs } = require("./controllers/docs.controller.js")

app.get("/api/topics", getTopics);

app.all("/api", getDocs)

app.all("/api/*", send404);

app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || "Internal Server Error";

    res.status(status).send({ msg: message });
});

module.exports = app;
