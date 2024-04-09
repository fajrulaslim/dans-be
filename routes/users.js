var express = require('express');
var router = express.Router();
const { 
  createUser,
  loginUser,
} = require("../controllers/UserController")

/* GET */
router.get('/', function(req, res, next) {
  res.send(`Please register on http://localhost:${process.env.PORT}/register`);
});

// POST
router.post("/register", createUser);
router.post("/login", loginUser);

module.exports = router;