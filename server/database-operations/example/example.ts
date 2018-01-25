// import handle from "../../helpers"
// import db from "../../db"
//
// let splice = null;
//
// let drop = `DROP TABLE IF EXISTS blah`;
//
// let create = `CREATE TABLE blah
//               (
//                 id int,
//                 name varchar(10),
//                 date DATE,
//                 time TIME,
//                 timestamp TIMESTAMP
//                )`;
// let insert = `INSERT INTO blah
//               VALUES (1, 'Jason', CURRENT_DATE,
//               CURRENT_TIME, CURRENT_TIMESTAMP)`;
// let update = `UPDATE blah
//               SET id = 2
//               WHERE name = 'Jason'`;
// let selectStmt = `SELECT * FROM blah`;
//
// export default function (res) {
//     db.setup(db.connection)
//         .then(() => {
//             res.write("==========\n\n");
//             res.write("Setup Resolved\n\n");
//             return db.reserve(db.connection);
//         }, (reason) => {
//             return Promise.reject(reason);
//         })
//         .then((connectionObject) => {
//             splice = connectionObject;
//             res.write("Reserve Resolved\n\n");
//             return db.prepare(splice)
//         }, (reason) => {
//             return Promise.reject(reason);
//         })
//         .then(() => {
//             res.write("Prepare Resolved\n\n");
//             return db.execute(splice, drop)
//         }, (reason) => {
//             return Promise.reject(reason);
//         })
//         .then(() => {
//             res.write("Drop Resolved\n\n");
//             return db.execute(splice, create)
//         }, (reason) => {
//             return Promise.reject(reason);
//         })
//         .then(() => {
//             res.write("Create Resolved\n\n");
//             return db.execute(splice, insert)
//         }, (reason) => {
//             return Promise.reject(reason);
//         })
//         .then(() => {
//             res.write("Insert Resolved\n\n");
//             return db.execute(splice, update)
//         }, (reason) => {
//             return Promise.reject(reason);
//         })
//         .then(() => {
//             res.write("Update Resolved\n\n");
//             return db.select(splice, selectStmt)
//         }, (reason) => {
//             return Promise.reject(reason);
//         })
//         .then((set) => {
//             res.write("Select Resolved\n");
//             if (set instanceof Array) {
//                 set.map((item) => {
//                     for (let prop in item) {
//                         res.write(`${prop} : ${item[prop]}\n`)
//                     }
//                 });
//             }
//             return db.release(splice)
//         }, (reason) => {
//             return Promise.reject(reason);
//         })
//         .then((set) => {
//             res.write("Released and Closed Connection\n\n");
//             res.end();
//             return set;
//         }, (reason) => {
//             return Promise.reject(reason);
//         })
//         .catch(handle.bind(null, res));
// }
