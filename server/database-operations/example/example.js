"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
const db_1 = require("../../db");
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
function default_1(res) {
    db_1.default.setup(db_1.default.connection)
        .then(() => {
        res.write("==========\n\n");
        res.write("Setup Resolved\n\n");
        return db_1.default.reserve(db_1.default.connection);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then((connectionObject) => {
        splice = connectionObject;
        res.write("Reserve Resolved\n\n");
        return db_1.default.prepare(splice);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Prepare Resolved\n\n");
        return db_1.default.execute(splice, drop);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Drop Resolved\n\n");
        return db_1.default.execute(splice, create);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Create Resolved\n\n");
        return db_1.default.execute(splice, insert);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Insert Resolved\n\n");
        return db_1.default.execute(splice, update);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then(() => {
        res.write("Update Resolved\n\n");
        return db_1.default.select(splice, selectStmt);
    }, (reason) => {
        return Promise.reject(reason);
    })
        .then((set) => {
        res.write("Select Resolved\n");
        if (set instanceof Array) {
            set.map((item) => {
                for (let prop in item) {
                    res.write(`${prop} : ${item[prop]}\n`);
                }
            });
        }
        return db_1.default.release(splice);
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
        .catch(helpers_1.default.bind(null, res));
}
exports.default = default_1;
