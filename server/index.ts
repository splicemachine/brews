import express = require('express');
import path = require('path');

const DIST_DIR = path.join(__dirname, "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");
const DEFAULT_PORT = 3000;

const app = express();

app.set("port", process.env.PORT || DEFAULT_PORT);
app.set("json spaces", 2);
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Pass to next layer of middleware
    next();
});

const server = app.listen(app.get("port"), () => {
    console.log("Server Started");
    server.keepAliveTimeout = 0;
});

/**
 * Production switcher
 */
if (process.env.NODE_ENV === "development") {
    /**
     * DEVELOPMENT
     */
    app.get("/", (req, res) => res.send("Development Mode!"));
} else {
    /**
     * PRODUCTION
     */
    app.use(express.static(DIST_DIR));
    app.get("/", (req, res) => res.sendFile(HTML_FILE));
}

/**
 * Import and configure the example route.
 * There's no way this one works anymore lol.
 */
// import example from "./database-operations/example/example";
// app.get("/api/v1/example", (req, res) => {
//     example(res);
// });

/**
 * Import and configure the ATP route.
 */
import {size, prepare} from "./database-operations/atp/atp";

app.get("/api/v1/prepare", prepare);
app.get("/api/v1/size", size);









