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

function handle(e) {
    if (e.message.includes("java.net.ConnectException")) {
        console.log("I don't think the database is turned on.")
    } else {
        console.log("I don't know what kind of error this is.", e.message)
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
let select = `SELECT * FROM blah`;

db.setup(db.connection)
    .then(() => {
        log.yellow("==========");
        log.green("Setup Resolved");
        return db.reserve(db.connection);
    }, (reason) => {
        return Promise.reject(reason);
    })
    .then((connectionObject) => {
        splice = connectionObject;
        log.green("Reserve Resolved");
        return db.prepare(splice)
    }, (reason) => {
        return Promise.reject(reason);
    })
    .then(() => {
        log.green("Prepare Resolved");
        return db.execute(splice, drop)
    }, (reason) => {
        return Promise.reject(reason);
    })
    .then(() => {
        log.green("Drop Resolved");
        return db.execute(splice, create)
    }, (reason) => {
        return Promise.reject(reason);
    })
    .then(() => {
        log.green("Create Resolved");
        return db.execute(splice, insert)
    }, (reason) => {
        return Promise.reject(reason);
    })
    .then(() => {
        log.green("Insert Resolved");
        return db.execute(splice, update)
    }, (reason) => {
        return Promise.reject(reason);
    })
    .then(() => {
        log.green("Update Resolved");
        return db.select(splice, select)
    }, (reason) => {
        return Promise.reject(reason);
    })
    .then((set) => {
        log.green("Select Resolved");
        console.log(set);
        return set;
    }, (reason) => {
        return Promise.reject(reason);
    })
    .catch(handle);

if (process.env.NODE_ENV === "development") {
    /**
     * DEVELOPMENT
     */
    app.get('/', (req, res) => res.send(db_statement ? db_statement : "Nothing from the db... :("));
} else {
    /**
     * PRODUCTION
     */
    app.use(express.static(DIST_DIR));
    app.get("*", (req, res) => res.sendFile(HTML_FILE));
}

app.listen(app.get("port"));


