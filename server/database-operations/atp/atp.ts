import statements from "./sql-statements";
import express = require("express");
import Database from "../../db";
import handle from "../../helpers";

let rejected = (reason)=>Promise.reject(reason);

export default function (res: express.Response) {

    let db = new Database();

    db._forced_transaction(statements.errorInvariant)
        .then(() => {
            console.log("Forced Cleanup Completed");
            return db.transaction(statements.create);
        }, rejected)
        .then(() => {
            console.log("Create Statements Completed");
            return db.transaction(statements.insert)
        }, rejected)
        .then(() => {
            console.log("Import Statements Completed");
            res.end();
        }, rejected)
        .catch(handle.bind(null, res));


}

