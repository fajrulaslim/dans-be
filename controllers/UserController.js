const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/UserModel")
const { jwtKey } = require("../config");

const EXP = process.env.TOKEN_EXP

async function checkUser(username) {
  let result;
  const data = await UserModel.findOne({ username: username });
  if (data) {
    result = "Username has been registered";
  }

  return result;
}

const createUser = async (req, res) => {
  const { username, password } = req.body
  const isAccountUsed = await checkUser(username);

  if (isAccountUsed) {
    return res.status(400).json({
      status: "Error",
      message: isAccountUsed,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(req.body.password, salt);

  try {
    const newUser = new UserModel({
      username: username,
      password: passwordHashed,
    });
    const user = await newUser.save();

    res.status(200).json({
      status: "Success",
      message: "Success registered user.",
      data: {
        _id: user._id,
        username: user.username,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(403).json({
        status: "Error",
        message: "Login failed. User not found.",
      });
    }

    const passwordVerified = await bcrypt.compare(password, user.password);
    if (!user.status) {
      return res.status(403).json({
        status: "Error",
        message: "Login failed. Please activate your account.",
      });
    }

    if (!passwordVerified) {
      return res.status(403).json({
        status: "Error",
        message: "Login failed. Password incorrect.",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      jwtKey,
      {
        expiresIn: parseInt(EXP) || 3600,
      }
    );

    res.status(200).json({
      status: "Success",
      message: "Login success",
      data: { _id: user._id, username: user.username },
      accessToken: {
        token: accessToken,
        type: "Bearer",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
}

module.exports = {
  createUser,
  loginUser
}; 