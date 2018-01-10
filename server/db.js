// noinspection NpmUsedModulesInstalled
let jdbc = require('jdbc');
// noinspection NpmUsedModulesInstalled
let jinst = require('jdbc/lib/jinst');

// noinspection Annotator
if (!jinst.isJvmCreated()) {
    // noinspection Annotator
    jinst.addOption("-Xrs");
    // noinspection Annotator
    jinst.setupClasspath([
        __dirname + '/lib/hsqldb.jar',
        __dirname + '/lib/derby.jar',
        __dirname + '/lib/splice.jar',
        __dirname + '/lib/derbyclient.jar',
        __dirname + '/lib/derbytools.jar'
    ]);
}

const config = {
    url: 'jdbc:splice://localhost:1528/splicedb;user=splice;password=admin',
    user: 'user',
    password: 'admin'
};

module.exports = {
    connection: new jdbc(config),
    setup: (db) => {
        return new Promise((resolve, reject) => {
            db.initialize(function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(db)
                }
            });
        });
    },
    reserve: (db) => {
        return new Promise((resolve, reject) => {
            if (db) {
                db.reserve((err, connectionObject) => {
                    if (connectionObject) {
                        // log.yellow("Using connection: " + connectionObject.uuid);
                        resolve(connectionObject)
                    } else {
                        reject(err)
                    }
                })
            } else {
                reject(new Error("no database connection provided"))
            }
        })
    },
    prepare: (db) => {
        return Promise.all([
            new Promise((resolve, reject) => {
                db.conn.setAutoCommit(false, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(db)
                    }
                });
            })
        ]);
    },
    execute: (db, stmt) => {
        return new Promise((resolve, reject) => {
            db.conn.createStatement(function (err, statement) {
                if (err) {
                    reject(err);
                } else {
                    statement.executeUpdate(stmt,
                        function (err, count) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(count);
                            }
                        });
                }
            });
        });
    },
    select: (db, stmt) => {
        return new Promise((resolve, reject) => {
            db.conn.createStatement(function (err, statement) {
                if (err) {
                    reject(err);
                } else {
                    // Adjust some statement options before use.  See statement.js for
                    // a full listing of supported options.
                    statement.setFetchSize(100, function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            statement.executeQuery(stmt,
                                function (err, resultset) {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        resultset.toObjArray(function (err, results) {
                                            resolve(results);
                                        });
                                    }
                                });
                        }
                    })
                }
            })
        })
    }
};



