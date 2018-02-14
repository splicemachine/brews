import env from "./environment"

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

const config = {
    url: env.JDBC_URL,
    user: "user",
    password: "admin"
};

export default class {

    private database: any;
    private connection: any;

    constructor() {
        this.database = new jdbc(config);
        this.connection = null;
    }

    public initialize() {
        console.log("Making a new DB connection");
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

    public transaction(statement, logger) {
        if (typeof statement === "string") {
            logger(statement);
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

    public preparedSelect(statement, logger, params) {

        /**
         * Mapping JS types to the names of the functions for prepared statements.
         * Based on the typeof the arguments in params, we'll prepare the statement.
         * Only number, string, and boolean are supported for now.
         * TODO: Support other types.
         */
        let method = {
            "number": "setInt",
            "boolean": "setBoolean",
            "string": "setString",
        };

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
                        params.map((val, idx, arr) => {
                            try {
                                s[method[typeof val]](idx + 1, val, (err) => {
                                    if (err) {
                                        console.log(`I got an error actually setting the method`);
                                        reject(err);
                                    } else {
                                        if (arr.length - 1 === idx) {
                                            /**
                                             * End of the array
                                             */
                                            after.call(this);
                                        }
                                    }
                                });
                            } catch (e) {
                                console.log(`I caught the exception`);
                                reject(e);
                            }
                        });

                        function after() {
                            s.executeQuery(function (err, resultset) {
                                if (err) {
                                    console.log(`I got an error during execution first part`);
                                    reject(err);
                                } else {
                                    resultset.toObjArray(function (err, results) {
                                        if (err) {
                                            console.log(`I got an error during execution`);
                                            reject(err);
                                        } else {
                                            resolve(results)
                                        }
                                    });
                                }
                            });
                        }

                    }
                })
            });
        }
        else {
            return serializePromiseFactoryArray(statement.map(s => () => this.preparedSelect(s, logger, params)));
        }
    }

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
