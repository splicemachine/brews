const express = require('express');
const path = require('path');
const db = require("./db");
const log = require("./log");
const app = express();
const DIST_DIR = path.join(__dirname, "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");
const DEFAULT_PORT = 3000;
let db_statement = null;
app.set("port", process.env.PORT || DEFAULT_PORT);
app.set('json spaces', 2);
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
function handle(e) {
    if (e.message.includes("ConnectException")) {
        console.log("I don't think the database is turned on.");
    }
    else if (e.message.includes("SQLNonTransientConnectionException")) {
        console.log("The database died while we were connnected to it.");
    }
    else {
        console.log("I don't know what kind of error this is.", e.message);
    }
}
let splice = null;
let drop = `DROP TABLE IF EXISTS blah`;
let create = `CREATE TABLE blah
              (
                id int,
                name varchar(10),
                date DATE,
                time TIME,
                timestamp TIMESTAMP
               )`;
let insert = `INSERT INTO blah
              VALUES (1, 'Jason', CURRENT_DATE, 
              CURRENT_TIME, CURRENT_TIMESTAMP)`;
let update = `UPDATE blah
              SET id = 2
              WHERE name = 'Jason'`;
let selectStmt = `SELECT * FROM blah`;
if (process.env.NODE_ENV === "development") {
    /**
     * DEVELOPMENT
     */
    app.get('/', (req, res) => res.send(db_statement ? db_statement : "Development Mode!"));
}
else {
    /**
     * PRODUCTION
     */
    app.use(express.static(DIST_DIR));
    app.get("/", (req, res) => res.sendFile(HTML_FILE));
}
app.get("/api/v1/me", (req, res) => {
    dbCall(res);
});
const server = app.listen(app.get("port"), () => {
    console.log("Server Started");
    server.keepAliveTimeout = 0;
});
function dbCall(res) {
    db.setup(db.connection)
        .then(() => {
        res.write("==========\n\n");
        res.write("Setup Resolved\n\n");
        return db.reserve(db.connection);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then((connectionObject) => {
        splice = connectionObject;
        res.write("Reserve Resolved\n\n");
        return db.prepare(splice);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Prepare Resolved\n\n");
        return db.execute(splice, drop);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Drop Resolved\n\n");
        return db.execute(splice, create);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Create Resolved\n\n");
        return db.execute(splice, insert);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Insert Resolved\n\n");
        return db.execute(splice, update);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Update Resolved\n\n");
        return db.select(splice, selectStmt);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then((set) => {
        res.write("Select Resolved\n");
        set.map((item) => {
            for (let prop in item) {
                res.write(`${prop} : ${item[prop]}\n`);
            }
        });
        return db.release(splice);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then((set) => {
        res.write("Released and Closed Connection\n\n");
        res.end();
        return set;
    }, (reason) => {
        return Promise.reject(reason);
    })
        .catch(handle);
}
