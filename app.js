const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./controllers/topics.controller.js");

app.get("/api/topics", getTopics);

app.use((req, res, next) => {
    const err = new Error("Path not found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    let status = err.status || 500;
    let message = err.message || "Internal Server Error";

    res.status(status).send({ msg: message });
});

module.exports = app;
