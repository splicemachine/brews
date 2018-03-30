import express = require("express");
import modelingRouter from "./modeling";
import atpRouter from "./atp";

const router = express.Router();

router.get("/", function (req, res) {
    res.send("main")
});

router.use("/modeling", modelingRouter);
router.use("/atp", atpRouter);

export default router;
