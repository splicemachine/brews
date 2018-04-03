import express = require('express');

const router = express.Router();

router.get("/", function (req, res) {
    res.send({
        status: "200",
        okiee: "dokiee",
        nothing: ""
    })
});

export default router;
