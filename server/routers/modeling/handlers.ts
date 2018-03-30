import express = require("express");
import {sample_datasets, output_sample, job_status, table_data} from "./test_data";

export function models(request: express.Request, response: express.Response) {
    response.send(table_data);
}

export function datasets(request: express.Request, response: express.Response) {
    response.send(sample_datasets);
}

export function action(request: express.Request, response: express.Response) {
    response.send("OK");
}

export function jobs(request: express.Request, response: express.Response) {
    response.send(job_status);
}

export function output(request: express.Request, response: express.Response) {
    response.send(output_sample);
}
