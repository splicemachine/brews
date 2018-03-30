import express = require('express');
import {models, datasets, action, jobs, output} from "./handlers"

const router = express.Router();
router.get("/", function (req, res) {
    res.send("modeling")
});

router.get("/models", models);
router.get("/datasets", datasets);
router.post("/action", action);
router.get("/jobs", jobs);
router.post("/output", output);

export default router;
