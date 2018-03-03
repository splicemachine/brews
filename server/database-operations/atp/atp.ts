import * as statements from "./sql-statements";
import express = require("express");
import Database from "../../db";
import {handle, writeToStreams} from "../../helpers";

let rejected = (reason) => Promise.reject(reason);

export function size(req: express.Request, res: express.Response) {
    res.send(String(Object.keys(statements).reduce((acc, stmt) => acc + statements[stmt].length, 0)));
    res.end();
}

export function addLine(req: express.Request, res: express.Response) {
    /***** REPEATED CODE *****/
    let db = null;
    db = new Database();
    /***** REPEATED CODE *****/

    db.initialize()
        .then(() => {
            return db.transaction(statements.deleteTimelineDates, ()=>{});
        }, rejected)
        .then(() => {
            return db.preparedTransaction(statements.addQuickCheckLine, () => {
            }, [req.body.itemNumber, req.body.quantity]);
        })
        .then((result) => {
            res.send(result);
            res.end();
        }, rejected)
        .catch(handle.bind(null, res))

}

export function runATP(req: express.Request, res: express.Response) {
    /***** REPEATED CODE *****/
    let db = null;
    db = new Database();
    /***** REPEATED CODE *****/
    let results = [];
    db.initialize()
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
        .catch(handle.bind(null, res))
}

export function clearLines(req: express.Request, res: express.Response) {
    /***** REPEATED CODE *****/
    let db = null;
    db = new Database();
    /***** REPEATED CODE *****/
    db.initialize()
        .then(() => {
            return db.transaction(statements.deleteTimelineDates, ()=>{});
        }, rejected)
        .then((r) => {
            res.send(r);
            res.end();
        }, rejected)
        .catch(handle.bind(null, res))
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
 */
// export function prepare(req: express.Request, res: express.Response) {
//
//     /***** REPEATED CODE *****/
//     let db = null;
//     let writer = (text) => {
//         writeToStreams(text, res.write.bind(res), console.log)
//     };
//     db = new Database();
//     /***** REPEATED CODE *****/
//
//     db.initialize()
//         .then(() => {
//             return db._forced_transaction(statements.force, writer);
//         })
//         .then(() => {
//             return db.transaction(statements.createSchema, writer);
//         }, rejected)
//         .then(() => {
//             return db.storedProcedure(statements.dataImport, writer)
//         }, rejected)
//         .then(() => {
//             res.end();
//         }, rejected)
//         .catch(handle.bind(null, res));
// }

/**
 * Generator for Select Handlers
 * This function is designed to return a handler for a request that will take parameters and return results.
 * The binding for the number of parameters is driven by the front end and needs to match the number of '?'
 * on the backend.
 */
export function generateSelectHandler(group) {
    return function (req: express.Request, res: express.Response) {
        /***** REPEATED CODE *****/
        let db = null;
        db = new Database();
        /***** REPEATED CODE *****/
        db.initialize()
            .then(() => {
                return db.preparedSelect(statements[group], () => {
                }, req.body.params);
            })
            .then((result) => {
                res.send(result);
                res.end();
            }, rejected)
            .catch(handle.bind(null, res))
    }
}

//
// export function addQuickCheckLine(req: express.Request, res: express.Response) {
//     /***** REPEATED CODE *****/
//     let db = null;
//     db = new Database();
//     /***** REPEATED CODE *****/
//     db.initialize()
//         .then(() => {
//             return db.preparedTransaction(statements.addQuickCheckLine, () => {
//             }, req.body.params);
//         })
//         .then((result) => {
//             res.send(result);
//             res.end();
//         }, rejected)
//         .catch(handle.bind(null, res))
//
// }
//
// export function deleteTimelineDates(req: express.Request, res: express.Response) {
//     /***** REPEATED CODE *****/
//     let db = null;
//     db = new Database();
//     /***** REPEATED CODE *****/
//     db.initialize()
//         .then(() => {
//             return db.preparedTransaction(statements.deleteTimelineDates);
//         })
//         .then((result) => {
//             res.send(result);
//             res.end();
//         }, rejected)
//         .catch(handle.bind(null, res))
//
// }
//
//
//
// export function addResultDate(req: express.Request, res: express.Response) {
//     /***** REPEATED CODE *****/
//     let db = null;
//     db = new Database();
//     /***** REPEATED CODE *****/
//     db.initialize()
//         .then(() => {
//             return db.preparedTransaction(statements.addResultDate, () => {
//             }, req.body.params);
//         })
//         .then((result) => {
//             res.send(result);
//             res.end();
//         }, rejected)
//         .catch(handle.bind(null, res))
//
// }
//
//
//
// export function addResultDates(req: express.Request, res: express.Response) {
//     /***** REPEATED CODE *****/
//     let db = null;
//     db = new Database();
//     /***** REPEATED CODE *****/
//     db.initialize()
//         .then(() => {
//             return db.preparedTransaction(statements.addResultDates, () => {
//             }, req.body.params);
//         })
//         .then((result) => {
//             res.send(result);
//             res.end();
//         }, rejected)
//         .catch(handle.bind(null, res))
//
// }
