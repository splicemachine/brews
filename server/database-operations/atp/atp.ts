import statements from "./sql-statements";
import express = require("express");
import Database from "../../db";
import {handle, writeToStreams} from "../../helpers";

let rejected = (reason) => Promise.reject(reason);


export function size(req: express.Request, res: express.Response) {
    res.send(String(Object.keys(statements).reduce((acc, stmt) => acc + statements[stmt].length, 0)));
    // res.end();
}

export function prepare(req: express.Request, res: express.Response) {

    let db = new Database();

    let writer = (text) => {
        writeToStreams(text, res.write.bind(res))
    };

    db._forced_transaction(statements.errorInvariant, writer)
        .then(() => {
            // writer("******* Forced Cleanup Completed *******");
            // res.flushHeaders();
            // res.flush();
            return db.transaction(statements.create, writer);
        }, rejected)
        .then(() => {
            // writer("******* Create Statements Completed *******");
            return db.transaction(statements.insert, writer)
        }, rejected)
        .then(() => {
            // writer("******* Import Statements Completed *******");
            res.end();
        }, rejected)
        .catch(handle.bind(null, res));


}

