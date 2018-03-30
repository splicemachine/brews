import express = require('express');
import {models, datasets, action, jobs, output} from "./handlers"

const router = express.Router();
router.get("/", function (req, res) {
    res.send("modeling")
});

/**
 * TODO: Get list of models. Populate First Screen.

 select * from MLDEMO.ML_MODEL_MANAGER

 */
router.get("/models", models);

/**
 * TODO: Get list of datasets. Populate Second Screen.

 select s.schemaname ||'.' || t.tablename from sys.sysschemas s join sys.systables t on s.schemaid = t.schemaid
 where t.tabletype <> 'S'
 and s.schemaname <> 'SYS'
 order by s.schemaname, t.tablename

 */
router.get("/datasets", datasets);

/**
 * TODO: Add action item to job list. Exit Second Screen.

 insert into MLDEMO.ML_JOBS (
 NAME, TYPE, FEATURES_TABLE , STATUS, UPDATE_DATE)
 Values (?,?, ?, 'NEW', CURRENT_TIMESTAMP)

 */
router.post("/action", action);

/**
 * TODO: Get list of jobs. Populate Third Screen.

 SELECT * FROM MLDEMO.ML_JOBS

 */
router.get("/jobs", jobs);

/**
 * TODO: Get output for specific job. Populate Fourth Screen.

 SELECT * FROM MLDEMO.ML_RUN_OUTPUT WHERE JOB_ID=?

 */
router.get("/output", output);

export default router;
