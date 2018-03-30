import express = require('express');

const router = express.Router();
router.get("/", function (req, res) {
    res.send("modeling")
});
// Car brands page
router.get('/brands', function (req, res) {
    res.send('Audi, BMW, Mercedes')
});

// Car models page
router.get('/models', function (req, res) {
    res.send('Audi Q7, BMW X5, Mercedes GL')
});

export default router;
