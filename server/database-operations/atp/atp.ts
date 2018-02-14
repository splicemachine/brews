import statements from "./sql-statements";
import express = require("express");
import Database from "../../db";
import {handle, writeToStreams} from "../../helpers";

let rejected = (reason) => Promise.reject(reason);

export function size(req: express.Request, res: express.Response) {
    res.send(String(Object.keys(statements).reduce((acc, stmt) => acc + statements[stmt].length, 0)));
    res.end();
}

export function prepare(req: express.Request, res: express.Response) {

    /***** REPEATED CODE *****/
    let db = null;
    let writer = (text) => {
        writeToStreams(text, res.write.bind(res), console.log)
    };
    db = new Database();
    /***** REPEATED CODE *****/

    db.initialize()
        .then(() => {
            console.log("initialize came back");
            return db._forced_transaction(statements.force, writer);
        })
        .then(() => {
            return db.transaction(statements.createSchema, writer);
        }, rejected)
        .then(() => {
            return db.storedProcedure(statements.dataImport, writer)
        }, rejected)
        .then(() => {
            res.end();
        }, rejected)
        .catch(handle.bind(null, res));
}

/**
 * TODO: Fire a describe to get these columns.
 * @param {e.Request} req
 * @param {e.Response} res
 */
export function transferOrdersColumns(req: express.Request, res: express.Response){

    const cols = [
        "TO_ID",
        "PO_ID",
        "SHIPFROM",
        "SHIPTO",
        "SHIPDATE",
        "DELIVERYDATE",
        "MODDELIVERYDATE",
        "SOURCEINVENTORY",
        "DESTINATIONINVENTORY",
        "QTY",
        "SUPPLIER",
        "ASN",
        "CONTAINER",
        "TRANSPORTMODE",
        "CARRIER",
        "FROMWEATHER",
        "TOWEATHER",
        "LATITUDE",
        "LONGITUDE"
    ];

    res.send(cols);
    return res.end();
}

export function transferOrderResults(req: express.Request, res: express.Response){

    /***** REPEATED CODE *****/
    let db = null;
    db = new Database();
    /***** REPEATED CODE *****/

    db.initialize()
        .then(()=>{
            return db.preparedSelect(statements.transferOrders, ()=>{},req.body.destination);
        })
        .then((result) => {
            res.send(result);
            res.end();
        }, rejected)
        .catch(handle.bind(null, res))
}
