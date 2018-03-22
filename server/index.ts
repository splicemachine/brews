import express = require('express');
import path = require('path');
import bodyParser = require("body-parser");

const DIST_DIR = path.join(__dirname, "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");
const FAVICON = path.join(__dirname, "..", "static", "img", "favicon.ico");
const DEFAULT_PORT = 3000;

const app = express();

const jsonParser = bodyParser.json();

app.set("port", process.env.PORT || DEFAULT_PORT);
app.set("json spaces", 2);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Production switcher
 */
if (process.env.NODE_ENV === "development") {
    /**
     * DEVELOPMENT
     */
    app.get("/", (req, res) => res.send("Development Mode!"));
    app.get("/favicon.ico", (req, res) => {
        console.log(`serving ${FAVICON}`);
        res.sendFile(FAVICON)
    });
} else {
    /**
     * PRODUCTION
     */
    app.use(express.static(DIST_DIR));
    app.get("/", (req, res) => res.sendFile(HTML_FILE));
    app.get("/favicon.ico", (req, res) => res.sendFile(FAVICON));
}

/**
 * Import all the functions you need to bind to endpoints.
 */
import {
    addLine,
    runATP,
    clearLines,
    prepare,
    generateSelectHandler
} from "./database-operations/atp/atp"

/**
 * Preparation handler that takes no parameters.
 */
app.get("/api/v1/prepare", prepare);

/**
 * Custom handlers.
 */
app.post("/api/v1/add-line", jsonParser, addLine);
app.post("/api/v1/run-atp", jsonParser, runATP);
app.post("/api/v1/clear-lines", jsonParser, clearLines);

/**
 * Generated functions for SELECT calls that do not take parameters.
 */
app.post("/api/v1/proposed-order", jsonParser, generateSelectHandler("proposedOrder"));
app.post("/api/v1/order-atp", jsonParser, generateSelectHandler("orderATP"));
app.post("/api/v1/line-item-atp", jsonParser, generateSelectHandler("lineItemATP"));

/**
 * This handler needs to be delared after all other app.use (and it would seem app.post et.al.)
 */
app.use(function (err, req, res, next) {
    res.status(500).json({message: err.message});
    next();
});

const server = app.listen(app.get("port"), () => {
    console.log("Server Started");
    server.keepAliveTimeout = 0;
});
