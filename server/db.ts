import env from "./environment"

let jdbc = require("jdbc");
let jinst = require("jdbc/lib/jinst");

if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    jinst.setupClasspath([
        __dirname + "/lib/hsqldb.jar",
        __dirname + "/lib/derby.jar",
        __dirname + "/lib/splice.jar",
        __dirname + "/lib/derbyclient.jar",
        __dirname + "/lib/derbytools.jar"
    ]);
}

const config = {
    url: env.JDBC_URL,
    user: "user",
    password: "admin"
};

/**
 * Do this once forever?
 * Looks like this is called at import time only. That's great for now.
 */
console.log("Making a new DB connection");
let database = new jdbc(config);

export default class {

    private database: any;
    private connection: any;

    constructor() {
        // this.connection = new jdbc(config);
        console.log("Serving Singleton Connection");
        this.database = database;
        this.connection = null;
    }

    public prime() {
        return new Promise((resolve, reject) => {
            this.database.initialize((err) => {
                if (err) {
                    reject(err)
                } else {
                    this.database.reserve((err, c) => {
                        if (c) {
                            this.connection = c.conn;
                            // console.log("this.connection", this.connection);
                            /**
                             * Just run each line! Thanks @Gene
                             */
                            this.connection.setAutoCommit(true, (err) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    resolve(true)
                                }
                            });
                        } else {
                            reject(err)
                        }
                    })
                }
            });
        })
    }

    public execute(statement: string | Array<string>) {
        if (typeof statement === "string") {
            console.log("Executing:", statement);
            return new Promise((resolve, reject) => {
                this.connection.createStatement(function (err, s) {
                    if (err) {
                        reject(err);
                    } else {
                        s.executeUpdate(statement,
                            function (err, count) {
                                if (err) {
                                    reject(err);
                                } else {
                                    console.log("Execution Complete!:", statement);
                                    resolve(count);
                                }
                            });
                    }
                });
            });
        } else {
            return new Promise((resolve) => {
                resolve(statement.map((s) => this.execute(s)).reduce((acc, val) => {
                    acc.push(val
                        .then((result) => {
                            return result;
                        }, (reason) => {
                            return reason;
                        }));
                    return acc;
                }, []))
            })
        }

    }

    public executeHard(statement: string | Array<string>) {
        if (typeof statement === "string") {
            console.log("Executing:", statement);
            return new Promise((resolve, reject) => {
                this.connection.createStatement(function (err, s) {
                    if (err) {
                        reject(err);
                    } else {
                        s.executeUpdate(statement,
                            function () {
                                /**
                                 * JUST RESOLVE
                                 */
                                resolve()
                            });
                    }
                });
            });
        } else {
            return new Promise((resolve) => {
                statement
                    .map((s) => this.execute(s))
                    .reduce((acc, val, idx, all) => {

                        val.then((result) => {
                            acc.push(result);
                            if (idx === all.length - 1) {
                                resolve();
                            }
                        }, (reason) => {
                            /**
                             * No.
                             */
                            // reject(reason)
                            acc.push(reason);
                            if (idx === all.length - 1) {
                                resolve();
                            }
                        });

                        return acc;
                    }, []);
                // resolve();
            });
        }
    }

}

// export default {
//     connection: conn,
//
//     setup: (db) => {
//         return new Promise((resolve, reject) => {
//             db.initialize(function (err) {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve(db)
//                 }
//             });
//         });
//
//     },
//     reserve: (db) => {
//         return new Promise((resolve, reject) => {
//             if (db) {
//                 db.reserve((err, connectionObject) => {
//                     if (connectionObject) {
//                         // log.yellow("Using connection: " + connectionObject.uuid);
//                         resolve(connectionObject)
//                     } else {
//                         reject(err)
//                     }
//                 })
//             } else {
//                 reject(new Error("no database connection provided"))
//             }
//         })
//     },
//     prepare: (db) => {
//         return Promise.all([
//             new Promise((resolve, reject) => {
//                 db.conn.setAutoCommit(false, (err) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve(db)
//                     }
//                 });
//             })
//         ]);
//     },
//
//
//
//
//
//
//
//     execute: (db, stmt) => {
//         return new Promise((resolve, reject) => {
//             db.conn.createStatement(function (err, statement) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     statement.executeUpdate(stmt,
//                         function (err, count) {
//                             if (err) {
//                                 reject(err);
//                             } else {
//                                 resolve(count);
//                             }
//                         });
//                 }
//             });
//         });
//     },
//     release: (db) => {
//         return new Promise((resolve, reject) => {
//             db.conn.commit(function (err, statement) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     db.conn.close(function (err) {
//                         if (err) {
//                             reject(err);
//                         }
//                         resolve();
//                     })
//                 }
//             });
//         });
//     },
//     select: (db, stmt) => {
//         return new Promise((resolve, reject) => {
//             db.conn.createStatement(function (err, statement) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     // Adjust some statement options before use.  See statement.js for
//                     // a full listing of supported options.
//                     statement.setFetchSize(100, function (err) {
//                         if (err) {
//                             reject(err);
//                         } else {
//                             statement.executeQuery(stmt,
//                                 function (err, resultset) {
//                                     if (err) {
//                                         reject(err)
//                                     } else {
//                                         resultset.toObjArray(function (err, results) {
//                                             resolve(results);
//                                         });
//                                     }
//                                 });
//                         }
//                     })
//                 }
//             })
//         })
//     }
// };
//
//
//
