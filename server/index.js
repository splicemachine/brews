const express = require('express');
const path = require('path');
const app = express();
const DIST_DIR = path.join(__dirname, "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");
const DEFAULT_PORT = 3000;

app.set("port", process.env.PORT || DEFAULT_PORT);

if(process.env.NODE_ENV === "development"){
    /**
     * DEVELOPMENT
     */
    app.get('/', (req, res) => res.send('This is the backend. Go away please.'));
}else{
    /**
     * PRODUCTION
     */
    app.use(express.static(DIST_DIR));
    app.get("*", (req, res) => res.sendFile(HTML_FILE));
}

app.listen(app.get("port"));
