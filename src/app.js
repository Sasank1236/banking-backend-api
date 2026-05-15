const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Backend Ledger API is running 🚀");
});

module.exports = app;