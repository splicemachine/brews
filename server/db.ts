/**
 * This is our library candidate.
 */

let jdbc = require("jdbc");
let jinst = require("jdbc/lib/jinst");

if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    jinst.setupClasspath([
        __dirname + "/lib/hsqldb.jar",
        __dirname + "/lib/derby.jar",
        __dirname + "/lib/db-client-2.7.0.1805-SNAPSHOT.jar",
        __dirname + "/lib/derbyclient.jar",
        __dirname + "/lib/derbytools.jar"
    ]);
}

export default class {

    private database: any;
    private connection: any;

    constructor(config) {
        if (config) {
            this.database = new jdbc(config);
            this.connection = null;
        } else {
            throw new Error("DB Construction requires configuration object.")
        }
    }

    /**
     * This should be called before any of the following functions.
     * It will set this.connection to an active connection each time.
     * @returns {Promise<any>}
     */
    public initialize() {
        return new Promise((resolve, reject) => {
            this.database.initialize((err) => {
                if (err) {
                    reject(err);
                } else {
                    this.database.reserve((err, c) => {
                        if (err) {
                            reject(err);
                        } else {
                            c.conn.setAutoCommit(false, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    this.connection = c.conn;
                                    resolve();
                                }
                            })
                        }
                    })
                }
            });
        })
    }

    /**
     * _forced_transaction will not throw errors for anything. It is a black box.
     * @param statement
     *  If statement is an array, this will return an array of promises.
     *  If statement is a string, this will return a promise by itself.
     * @param logger
     *  Logger will be called with an individual string.
     * @returns {any}
     *  TODO: Yea we should probably solidify what this returns, either just an array always, or do some checks.
     * @private
     */
    public _forced_transaction(statement, logger) {
        if (typeof statement === "string") {
            logger(statement);
            return new Promise((resolve) => {
                this.connection.createStatement((e, s) => {
                    s.execute(statement, () => {
                        this.connection.commit(() => {
                            resolve();
                        });
                    });
                });
            })
        }
        else {
            return serializePromiseFactoryArray(statement.map(s => () => this._forced_transaction(s, logger)));
        }
    }

    /**
     * storedProcedure can be used on statements like 's3 import'.
     * @param statement
     * @param logger
     * @returns {any}
     */
    public storedProcedure(statement, logger) {
        if (typeof statement === "string") {
            logger(statement);
            return new Promise((resolve, reject) => {
                this.connection.prepareCall((err, s) => {
                    if (err) {
                        reject(err);
                    } else {
                        s.execute(statement, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                this.connection.commit((err) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            }
                        });
                    }
                });
            })
        }
        else {
            return serializePromiseFactoryArray(statement.map(s => () => this.transaction(s, logger)));
        }
    }

    /**
     * transaction will accept the same style statements as _forced_transaction, but provides error reporting.
     * @param statement
     * @param logger
     * @returns {any}
     */
    public transaction(statement, logger) {
        if (typeof statement === "string") {
            if (typeof logger === "function") {
                logger(statement);
            }
            return new Promise((resolve, reject) => {
                this.connection.createStatement((err, s) => {
                    if (err) {
                        reject(err);
                    } else {
                        s.execute(statement, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                this.connection.commit((err) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            }
                        });
                    }
                });
            })
        }
        else {
            return serializePromiseFactoryArray(statement.map(s => () => this.transaction(s, logger)));
        }
    }

    private mapParameters(preparedStatement, params) {
        /**
         * Mapping JS types to the names of the functions for prepared statements.
         * Based on the typeof the arguments in params, we'll prepare the statement.
         * Only number, string, and boolean are supported for now.
         * TODO: Support other types. statement.setDate
         */
        let method = {
            "number": "setInt",
            "boolean": "setBoolean",
            "string": "setString",
        };
        return new Promise((resolve, reject) => {
            if (params && params.length > 0) {
                params.map((val, idx, arr) => {
                    /**
                     * This try-catch is temporary to catch setter functionality issues. TODO above.
                     */
                    try {
                        preparedStatement[method[typeof val]](idx + 1, val, (err) => {
                            if (err) {
                                reject(err);
                            } else if (arr.length - 1 === idx) {
                                /**
                                 * End of the array
                                 */
                                resolve(preparedStatement)
                            }
                        });
                    } catch (e) {
                        reject(e);
                    }
                });
            } else {
                resolve(preparedStatement)
            }
        });
    }

    public preparedTransaction(statement, logger, params) {
        /**
         * Make sure that the statement to prepare is actually a string.
         */
        if (typeof statement === "string") {
            if (typeof logger === "function") {
                logger(statement);
            }
            return new Promise((resolve, reject) => {
                this.connection.prepareStatement(statement, (err, s) => {
                    if (err) {
                        reject(err)
                    } else {
                        this.mapParameters(s, params)
                        /**
                         * TODO: Suppressed TypeScript because I don't have time to write the whole type definition file.
                         */
                            .then((prepared: any) => {
                                /**
                                 * This is where I changed from executeQuery to executeUpdate
                                 */
                                prepared.executeUpdate((err, numberOfRows) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        /**
                                         * Looks like you need to commit when you run an executeUpdate
                                         * TODO: Is this a scalable pattern?
                                         */
                                        this.connection.commit((e) => {
                                            if (e) {
                                                reject(e)
                                            } else {
                                                resolve(numberOfRows);
                                            }
                                        });
                                    }
                                });
                            })
                            .catch(reject);
                    }
                })
            });
        }
        else {
            return serializePromiseFactoryArray(statement.map(s => () => this.preparedTransaction(s, logger, params)));
        }
    }

    public preparedSelect(statement, logger, params) {
        /**
         * Make sure that the statement to prepare is actually a string.
         */
        if (typeof statement === "string") {
            logger(statement);
            return new Promise((resolve, reject) => {
                this.connection.prepareStatement(statement, (err, s) => {
                    if (err) {
                        reject(err)
                    } else {
                        this.mapParameters(s, params)
                        /**
                         * TODO: Suppressed TypeScript because I don't have time to write the whole type definition file.
                         */
                            .then((prepared: any) => {
                                /**
                                 * We do not need to commit for executeQuery, it is not a transaction.
                                 * All we have to do is transform the r
                                 */
                                prepared.executeQuery((err, resultset) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resultset.toObjArray(function (err, results) {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                resolve(results)
                                            }
                                        });
                                    }
                                });
                            })
                            .catch(reject);
                    }
                })
            });
        }
        else {
            return serializePromiseFactoryArray(statement.map(s => () => this.preparedSelect(s, logger, params)));
        }
    }
}

/**
 * https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
 * @param arr is an Array of functions that return promises.
 * They need to be functions because invocation causes the sequential evaluation of promises.
 */
const serializePromiseFactoryArray = arr =>
    arr.reduce((acc, ele) =>
            acc.then(result => ele().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]));
