import express = require('express');
import bodyParser = require("body-parser");
import {models, deleteModel, datasets, action, jobs, output} from "./handlers"

const jsonParser = bodyParser.json();

const router = express.Router();
router.get("/", function (req, res) {
    res.send("modeling")
});

router.get("/models", models);
router.delete("/models", jsonParser, deleteModel);
router.get("/datasets", datasets);
router.post("/action", jsonParser, action);
router.get("/jobs", jobs);
router.post("/output", jsonParser, output);

export default router;
