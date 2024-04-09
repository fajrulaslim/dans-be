var express = require('express');
var router = express.Router();
const { verifyToken } = require('../middlewares/verification');
const { 
    getAllJoblist,
    getJobDetail,
} = require("../controllers/JoblistController")

/* GET */
router.get("/", verifyToken, getAllJoblist);
router.get("/detail/:id", verifyToken, getJobDetail);

module.exports = router;