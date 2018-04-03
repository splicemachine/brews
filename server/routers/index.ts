import express = require("express");
import modelingRouter from "./modeling";
import atpRouter from "./atp";
import status from "./status";

const router = express.Router();

router.get("/", function (req, res) {
    res.send("main")
});

router.use("/modeling", modelingRouter);
router.use("/atp", atpRouter);
router.use("/status", status);

export default router;
