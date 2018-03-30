import express = require('express');
import bodyParser = require("body-parser");

const jsonParser = bodyParser.json();
const router = express.Router();

router.get("/", function (req, res) {
    res.send("atp")
});

/**
 * Import all the functions you need to bind to endpoints.
 */
import {
    addLine,
    runATP,
    clearLines,
    prepare,
    generateSelectHandler
} from "./atp"

/**
 * Preparation handler that takes no parameters..
 */
router.get("/prepare", prepare);

/**
 * Custom handlers.
 */
router.post("/add-line", jsonParser, addLine);
router.post("/run-atp", jsonParser, runATP);
router.post("/clear-lines", jsonParser, clearLines);

/**
 * Generated functions for SELECT calls that do not take parameters.
 */
router.post("/proposed-order", jsonParser, generateSelectHandler("proposedOrder"));
router.post("/order-atp", jsonParser, generateSelectHandler("orderATP"));
router.post("/line-item-atp", jsonParser, generateSelectHandler("lineItemATP"));

export default router;
