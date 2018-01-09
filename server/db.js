const jinst = require('@splice-machine/splice-jdbc/lib/jinst');
const dm = require('@splice-machine/splice-jdbc/lib/drivermanager');
const Connection = require('@splice-machine/splice-jdbc/lib/connection');

if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    jinst.setupClasspath([
        '/Users/admin/workspace/brews/node_modules/@splice-machine/splice-jdbc/drivers/hsqldb.jar',
        '/Users/admin/workspace/brews/node_modules/@splice-machine/splice-jdbc/drivers/derby.jar',
        '/Users/admin/workspace/brews/node_modules/@splice-machine/splice-jdbc/drivers/splice.jar',
        '/Users/admin/workspace/brews/node_modules/@splice-machine/splice-jdbc/drivers/derbyclient.jar',
        '/Users/admin/workspace/brews/node_modules/@splice-machine/splice-jdbc/drivers/derbytools.jar'
    ]);
}
const config = {
    url: 'jdbc:splice://localhost:1528/splicedb;user=splice;password=admin',
    user: 'user',
    password: 'admin'
};

let testconn = null;

module.exports = {
    setUp: function (callback) {
        if (testconn === null) {
            dm.getConnection(config.url, config.user, config.password, function (err, conn) {
                if (err) {
                    callback(err)
                } else {
                    testconn = new Connection(conn);
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    },
    testcreatestatment: function (cb) {
        testconn.createStatement(function (err, statement) {
            cb(err, statement)
        });
    },
    testcreatetable: function (cb) {
        testconn.createStatement(function (err, statement) {
            if (err) {
                cb(err, statement);
            } else {
                var create = "CREATE TABLE blah ";
                create += "(id int, bi bigint, name varchar(10), date DATE, time TIME, timestamp TIMESTAMP)";
                statement.executeUpdate(create, function (err, result) {
                    cb(err, result);
                });
            }
        });
    },
    testinsert: function (cb) {
        testconn.createStatement(function (err, statement) {
            if (err) {
                cb(err, statement);
            } else {
                var insert = "INSERT INTO blah VALUES ";
                insert += "(1, 9223372036854775807, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP)";
                statement.executeUpdate(insert, function (err, result) {
                    cb(err, result);
                });
            }
        });
    },
    testupdate: function (cb) {
        testconn.createStatement(function (err, statement) {
            if (err) {
                cb(err, statement);
            } else {
                statement.executeUpdate("UPDATE blah SET id = 2 WHERE name = 'Jason'", function (err, result) {
                    cb(err, result);
                });
            }
        });
    },
    testselect: function (cb) {
        testconn.createStatement(function (err, statement) {
            if (err) {
                cb(err, statement);
            } else {
                statement.executeQuery("SELECT * FROM blah", function (err, resultset) {
                    cb(err, resultset);
                });
            }
        });
    },
};
