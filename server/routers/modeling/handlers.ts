import express = require("express");
import {modeling_db_config} from "../../environment";
import Database from "../../db";
import {
    select_models,
    select_datasets,
    job_status,
    job_output,
    insert_job,
    soft_delete
} from "./sql";

let rejected = (reason) => Promise.reject(reason);

function errorHandler(next: express.NextFunction, message: string) {
    console.log("ATP Error. Promoting to Express Error Handling.");
    next(new Error(message));
}

export function models(request: express.Request, response: express.Response, next: express.NextFunction) {
    let db = new Database(modeling_db_config);
    db.initialize()
        .then(() => {
            return db.preparedSelect(select_models, () => {
            }, []);
        })
        .then((result) => {
            response.send(result);
            response.end();
        }, rejected)
        .catch(errorHandler.bind(null, next));
}

export function deleteModel(request: express.Request, response: express.Response, next: express.NextFunction) {
    let db = new Database(modeling_db_config);
    db.initialize()
        .then(() => {
            return db.preparedTransaction(soft_delete, () => {
            }, [request.body["NAME"]]);
        })
        .then((result) => {
            response.send(result);
            response.end();
        }, rejected)
        .catch(errorHandler.bind(null, next));
}

export function datasets(request: express.Request, response: express.Response, next: express.NextFunction) {
    let db = new Database(modeling_db_config);
    db.initialize()
        .then(() => {
            return db.preparedSelect(select_datasets, () => {
            }, []);
        })
        .then((result) => {
            response.send(result);
            response.end();
        }, rejected)
        .catch(errorHandler.bind(null, next));
}

export function action(request: express.Request, response: express.Response, next: express.NextFunction) {
    let db = new Database(modeling_db_config);
    db.initialize()
        .then(() => {
            return db.preparedTransaction(insert_job, () => {
            }, [request.body.model.name, request.body.action, request.body.dataset.name]);
        })
        .then((result) => {
            response.send(result);
            response.end();
        }, rejected)
        .catch(errorHandler.bind(null, next));
}

export function jobs(request: express.Request, response: express.Response, next: express.NextFunction) {
    let db = new Database(modeling_db_config);
    db.initialize()
        .then(() => {
            return db.preparedSelect(job_status, () => {
            }, []);
        })
        .then((result) => {
            response.send(result);
            response.end();
        }, rejected)
        .catch(errorHandler.bind(null, next));
}

export function output(request: express.Request, response: express.Response, next: express.NextFunction) {
    let job = {};
    if (request.body && request.body.length > 0) {
        job = request.body[0];
    }
    let db = new Database(modeling_db_config);
    db.initialize()
        .then(() => {
            return db.preparedSelect(
                job_output,
                noop,
                [job["ID"]]
            );
        })
        .then((result) => {
            response.send(result);
            response.end();
        }, rejected)
        .catch(errorHandler.bind(null, next));
}

function noop() {
}
