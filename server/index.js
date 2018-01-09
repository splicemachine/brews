const express = require('express');
const path = require('path');
const db = require("./db");

const app = express();
const DIST_DIR = path.join(__dirname, "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");
const DEFAULT_PORT = 3000;

let db_statement = null;

app.set("port", process.env.PORT || DEFAULT_PORT);
app.set('json spaces', 2);

db.setUp((err)=>{
    console.log("Setup??", err);
    if(err === null){
        db.testcreatestatment((err, statement)=>{
            console.log("Create Statement", err, statement);
            db_statement = statement;
            db.testcreatetable((err, thing)=>{
                console.log("CREATE TABLE", err, thing)
                db.testinsert((err, thing)=>{

                    console.log("insert??", err, thing)
                })
            })
        })
    }
});

if(process.env.NODE_ENV === "development"){
    /**
     * DEVELOPMENT
     */
    app.get('/', (req, res) => res.send(db_statement ? db_statement : "Nothing from the db... :("));
}else{
    /**
     * PRODUCTION
     */
    app.use(express.static(DIST_DIR));
    app.get("*", (req, res) => res.sendFile(HTML_FILE));
}

app.listen(app.get("port"));


