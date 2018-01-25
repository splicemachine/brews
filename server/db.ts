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
let connection = null;

database.initialize((err) => {
    if (err) {
        throw new Error(err)
    } else {
        database.reserve((err, c) => {
            if (err) {
                throw new Error(err)
            } else {
                c.conn.setAutoCommit(false, (err) => {
                    if (err) {
                        throw new Error(err)
                    } else {
                        connection = c.conn;
                    }
                })
            }
        })
    }
});

export default class {

    private database: any;
    private connection: any;

    constructor() {
        console.log("Serving Singleton Connection");
        this.database = database;
        this.connection = connection;
    }

    public transaction(statement) {
        if (typeof statement === "string") {
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
            return serializePromiseFactoryArray(statement.map(s => () => this.transaction(s)));
        }
    }

    public _forced_transaction(statement) {
        if (typeof statement === "string") {
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
            return serializePromiseFactoryArray(statement.map(s => () => this.transaction(s)));
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
