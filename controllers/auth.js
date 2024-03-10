const authModel = require("../models/auth.js");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const registerPOST = async (req, res) => {
  const { firstName, lastName, email, username, password, confirm } = req.body;
  const user = await authModel.findOne({
    $or: [{ email }, { username: email }],
  });
  if (!validator.isEmail(email)) {
    res.status(500).json({ message: "invalid email" });
    return;
  }

  if (user) {
    return res.status(500).json({ message: "This E-Mail is used!" });
  }

  if (password.length < 8) {
    res.json({
      message: "Password must be 8 characters or longer",
    });
    return;
  }

  if (password !== confirm) {
    res.json({
      message: "Password must be same",
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await authModel.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    const userToken = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      status: "OK",
      newUser,
      userToken,
    });
  } catch (error) {
    console.error("Error,", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginPOST = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authModel.findOne({
      $or: [{ email }, { username: email }],
    });
    if (!user) {
      return res.status(500).json({
        message: "User not found.",
      });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);

    if (!comparedPassword) {
      return res.status(500).json({
        message: "Password not match.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.SECRET_TOKEN,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      status: "200",
      user: user,
      token,
    });
  } catch (error) {
    console.error("Error,", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerPOST, loginPOST };
