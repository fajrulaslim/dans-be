const jwt = require('jsonwebtoken')
const { jwtKey } = require('../config')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, jwtKey, (err, user) => {
            if (err) return res.status(401).json("Login required. Please login.")
            req.user = user;
            next();
        })
    } else {
        return res.status(401).json("Authetication Failed.")
    }
}

module.exports = {
    verifyToken,
};