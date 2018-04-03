import * as statements from "./sql";
import express = require("express");
import Database from "../../db";
import {atp_db_config} from "../../environment";

let rejected = (reason) => Promise.reject(reason);

function errorHandler(next: express.NextFunction, message: string) {
    console.log("ATP Error. Promoting to Express Error Handling.");
    next(new Error(message));
}

export function addLine(req: express.Request, res: express.Response, next: express.NextFunction) {

    let db = null;
    db = new Database(atp_db_config);


    db.initialize()
        .then(() => {
            return db.transaction(statements.deleteTimelineDates, () => {
            });
        }, rejected)
        .then(() => {
            return db.preparedTransaction(statements.addQuickCheckLine, () => {
            }, [req.body.itemNumber, req.body.quantity]);
        })
        .then((result) => {
            res.send(result);
            res.end();
        }, rejected)
        .catch(errorHandler.bind(null, next));
}

export function runATP(req: express.Request, res: express.Response, next: express.NextFunction) {

    let db = null;
    db = new Database(atp_db_config);

    let results = [];
    db.initialize()
        .then(() => {
            return db.transaction(statements.deleteTimelineDates, () => {
            });
        }, rejected)
        .then(() => {
            return db.preparedTransaction(statements.addResultDate, () => {
            }, [req.body.targetDate, req.body.targetDate]);
        })
        .then((r) => {
            results.push(r);
            return db.preparedTransaction(statements.addResultDates, () => {
            }, [req.body.targetDate, req.body.targetDate, req.body.targetDate]);
        })
        .then((r) => {
            results.push(r);
            res.send(results);
            res.end();
        }, rejected)
        .catch(errorHandler.bind(null, next));
}

export function clearLines(req: express.Request, res: express.Response, next: express.NextFunction) {

    let db = null;
    db = new Database(atp_db_config);

    db.initialize()
        .then(() => {
            return db.transaction([...statements.deleteTimelineDates, ...statements.deleteQuickCheckLines], () => {
            });
        }, rejected)
        .then((r) => {
            res.send(r);
            res.end();
        }, rejected)
        .catch(errorHandler.bind(null, next));
}

/**
 * Direct handler used for the prepare binding.
 * This handler runs several different types of database calls:
 *  _forced_transaction
 *      These are table drops and the like that we want to run without regard to error.
 *  transaction
 *      These are table creation, they take no parameters and return no results.
 *  storedProcedure
 *      These are the S3 import calls, they take no parameters and return no results.
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export function prepare(req: express.Request, res: express.Response, next: express.NextFunction) {


    let db = null;
    let writer = (text) => {
        writeToStreams(text, res.write.bind(res), console.log)
    };
    db = new Database(atp_db_config);


    db.initialize()
        .then(() => {
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
        .catch(errorHandler.bind(null, next));
}

/**
 * writeToStreams will write a message to a variadic number of functions.
 * @param {string} message: The string message to be written to the list of functions.
 * @param {() => any} fns: It is assumed that all other parameters are functions to be called.
 */
function writeToStreams(message: string, ...fns: Array<() => any>) {
    fns.forEach((fn) => {
        fn.call(null, message)
    })
}

/**
 * Generator for Select Handlers
 * This function is designed to return a handler for a request that will take parameters and return results.
 * The binding for the number of parameters is driven by the front end and needs to match the number of '?'
 * on the backend.
 */
export function generateSelectHandler(group) {
    return function (req: express.Request, res: express.Response, next: express.NextFunction) {

        let db = null;
        db = new Database(atp_db_config);

        db.initialize()
            .then(() => {
                return db.preparedSelect(statements[group], () => {
                }, req.body.params);
            })
            .then((result) => {
                res.send(result);
                res.end();
            }, rejected)
            .catch(errorHandler.bind(null, next));
    }
}
