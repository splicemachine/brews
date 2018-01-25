import express = require('express');

/**
 * writeToStreams will write a message to a variadic number of functions.
 * @param {string} message: The string message to be written to the list of functions.
 * @param {() => any} fns: It is assumed that all other parameters are functions to be called.
 */
export function writeToStreams(message: string, ...fns: Array<() => any>) {
    fns.forEach((fn) => {
        fn.call(null, message)
    })
}

/**
 * This is where we're defining the errors we find.
 * @param {e.Response} response
 * @param {Error} e
 */
export function handle(response: express.Response, e: Error) {
    if (e.message.includes("ConnectException")) {
        writeToStreams("I don't think the database is turned on.\n", console.log, response.write.bind(response));
    } else if (e.message.includes("SQLNonTransientConnectionException")) {
        writeToStreams("The database died while we were connected to it.\n", console.log, response.write.bind(response));
    } else if (e.message.includes("INVALID ARGUMENTS")) {
        writeToStreams(`I don't think you set the databases's environment variable. JDBC_URL is ... ${process.env.JDBC_URL ? "set" : "unset"}\n`, console.log, response.write.bind(response));
    } else {
        writeToStreams("I don't know what kind of error this is.\n", console.log, response.write.bind(response));
    }
    writeToStreams(`Error:\n ${e.message}`, console.log, response.write.bind(response));
    response.end();
}
