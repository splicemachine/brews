import express = require('express');
import path = require('path');

const DIST_DIR = path.join(__dirname, "./client");
const HTML_FILE = path.join(DIST_DIR, "index.html");
const FAVICON = path.join(__dirname, "..", "static", "img", "favicon.ico");
const DEFAULT_PORT = 3000;

const app = express();

app.set("port", process.env.PORT || DEFAULT_PORT);
app.set("json spaces", 2);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send("POST");
    }
    else {
        next();
    }
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
 * Mount all the routes.
 */
import apiRouter from "./routers";

app.use("/api/v1", apiRouter);

/**
 * Error handling.
 * This handler needs to be delared after all other app.use (and it would seem app.post et.al.)
 */
app.use(function (err, req, res, next) {
    res.status(500).json({message: err.message});
    next();
    // /**
    //  * This is where we're defining the errors we find.
    //  * @param {e.Response} response
    //  * @param {Error} e
    //  */
    // export function handle(response: express.Response, e: Error) {
    //     console.log("Inside handle");
    //     if (e.message.includes("ConnectException")) {
    //         writeToStreams("I don't think the database is turned on.\n", console.log, response.write.bind(response));
    //     } else if (e.message.includes("SQLNonTransientConnectionException")) {
    //         writeToStreams("The database died while we were connected to it.\n", console.log, response.write.bind(response));
    //     } else if (e.message.includes("INVALID ARGUMENTS")) {
    //         writeToStreams(`I don't think you set the databases's environment variable. JDBC_URL is ... ${process.env.ATP_JDBC_URL ? "set" : "unset"}\n`, console.log, response.write.bind(response));
    //     } else {
    //         writeToStreams("I don't know what kind of error this is.\n", console.log, response.write.bind(response));
    //     }
    //     writeToStreams(`Error:\n ${e.message}`, console.log, response.write.bind(response));
    //     response.end();
    // }
});

/**
 * Listen last.
 * @type {"http".Server}
 */
const server = app.listen(app.get("port"), () => {
    console.log("Brews Server Started");
    server.keepAliveTimeout = 0;
});

process.on('SIGINT', () => {
    console.log("Bye bye!");
    process.exit();
});
