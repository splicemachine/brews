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

    let db = null;
    let writer = (text) => {
        writeToStreams(text, res.write.bind(res), console.log)
    };

    // try {

    db = new Database();
    db.initialize()
        .then(() => {
            console.log("initialize came back");
            return db._forced_transaction(statements.errorInvariant, writer);
        })
        .then(() => {
            return db.transaction(statements.create, writer);
        }, rejected)
        .then(() => {
            return db.storedProcedure(statements.insert, writer)
        }, rejected)
        .then(() => {
            res.end();
        }, rejected)
        .catch(handle.bind(null, res));

    // } catch (e) {
    //     console.log("Caught exception");
    //     handle.bind(null, res, e);
    // }


}

