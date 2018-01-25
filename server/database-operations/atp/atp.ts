import statements from "./sql-statements";
import express = require("express");
import Database from "../../db";
import handle from "../../helpers";

let rejected = (reason)=>Promise.reject(reason);

export default function (res: express.Response) {

    let db = new Database();

    db._forced_transaction(statements.errorInvariant)
        .then(() => {
            console.log("Executing Normal");
            return db.transaction(statements.create);
        }, rejected)
        .then((result) => {
            console.log("Execute Success", result);
            res.end();
        }, rejected)
        .catch(handle.bind(null, res));


}

