import express = require('express');
import path = require('path');
import bodyParser = require("body-parser");

const DIST_DIR = path.join(__dirname, "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");
const FAVICON = path.join(__dirname, "..", "static", "img", "favicon.ico");
const DEFAULT_PORT = 3000;

const app = express();

const jsonParser = bodyParser.json();

app.set("port", process.env.PORT || DEFAULT_PORT);
app.set("json spaces", 2);

// console.log("WELL", process.env.NODE_ENV);
// app.use(function (req, res, next) {
//     console.log("why won't you set headers>");
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     next();
// });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = app.listen(app.get("port"), () => {
    console.log("Server Started");
    server.keepAliveTimeout = 0;
});

/**
 * Production switcher
 */
if (process.env.NODE_ENV === "development") {
    /**
     * DEVELOPMENT
     */
    app.get("/", (req, res) => res.send("Development Mode!"));
    app.get("/favicon.ico", (req, res) => {
        console.log(`serving ${FAVICON}`);
        res.sendFile(FAVICON)
    });
} else {
    /**
     * PRODUCTION
     */
    app.use(express.static(DIST_DIR));
    app.get("/", (req, res) => res.sendFile(HTML_FILE));
    app.get("/favicon.ico", (req, res) => res.sendFile(FAVICON));
}

/**
 * Import all the functions you need to bind to endpoints.
 */
import {
    addLine,
    runATP,
    clearLines,
    prepare,
    generateSelectHandler
} from "./database-operations/atp/atp"

/**
 * Preparation handler that takes no parameters.
 */
app.get("/api/v1/prepare", prepare);

/**
 * Custom handlers.
 */
app.post("/api/v1/add-line", jsonParser, addLine);
app.post("/api/v1/run-atp", jsonParser, runATP);
app.post("/api/v1/clear-lines", jsonParser, clearLines);

/**
 * Generated functions for SELECT calls that do not take parameters.
 */
app.post("/api/v1/proposed-order", jsonParser, generateSelectHandler("proposedOrder"));
app.post("/api/v1/order-atp", jsonParser, generateSelectHandler("orderATP"));
app.post("/api/v1/line-item-atp", jsonParser, generateSelectHandler("lineItemATP"));

/**
 * Deprecated Handlers
 */
// import {
//     generateSelectHandler
// } from "./database-operations/atp/atp";
//
// app.post("/api/v1/transfer-orders", jsonParser, generateSelectHandler("transferOrders"));
// app.post("/api/v1/atp-on-date", jsonParser, generateSelectHandler("atpOnDate"));
// app.post("/api/v1/tracking-inventory-as-timelines", jsonParser, generateSelectHandler("trackingInventoryAsTimelines"));
// app.post("/api/v1/inventory-on-date", jsonParser, generateSelectHandler("inventoryOnDate"));
// app.post("/api/v1/proposed-order", jsonParser, generateSelectHandler("proposedOrder"));
// app.post("/api/v1/order-atp", jsonParser, generateSelectHandler("orderATP"));
// app.post("/api/v1/line-item-atp", jsonParser, generateSelectHandler("lineItemATP"));
//
// import {
//     addQuickCheckLine,
//     deleteTimelineDates,
//     addResultDate,
//     addResultDates,
// } from "./database-operations/atp/atp";
//
// app.post("/api/v1/add-quick-check-line", jsonParser, addQuickCheckLine);
// app.post("/api/v1/delete-timeline-dates", jsonParser, deleteTimelineDates);
//
//
// app.post("/api/v1/add-result-date", jsonParser, addResultDate);
// app.post("/api/v1/add-result-dates", jsonParser, addResultDates);
