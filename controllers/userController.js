const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mainLayout = "../views/layouts/main.ejs";

// Login page
// GET /login
const login = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.SECRET);
      return res.redirect("/home");
    } catch (error) {
      // If Token is invalid, clear it
      res.clearCookie("accessToken");
    }
  }
  res.render("login", { layout: mainLayout });
};

// Login user
// POST /login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: "All fields are required" });
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Register page
// GET /register
const getRegister = (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.SECRET);
      return res.redirect("/home");
    } catch (error) {
      res.clearCookie("accessToken");
    }
  }
  res.render("register", { layout: mainLayout });
};

// Register user
// POST /register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ message: "Fill in required fields" });
    }

    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });

    if (emailExists) {
      return res
        .status(409)
        .json({ message: "Email already exists, choose other email please" });
    }

    if (password.trim().length < 6) {
      return res
        .status(422)
        .json({ message: "Password should be at least 6 characters" });
    }

    if (password !== password2) {
      return res.status(422).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPassword,
    });

    res.status(201).json({ message: `New user ${newUser.email} registered` });
  } catch (error) {
    res.status(500).json({ message: "User registration failed" });
  }
};

// Home page
// GET /home
const home = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Something wrong fetching data" });
    }
    res.render("home", { user, layout: mainLayout });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Profile page
// GET /profile/:_id
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.render("profile", { user, layout: mainLayout });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Update profile
// POST /profile/:_id
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    const userId = req.params._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current Password is invalid" });
    }

    // Name update
    if (name && name !== user.name) {
      user.name = name;
    }

    // Email update
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });

      if (emailExists) {
        return res.status(409).json({
          message: "Email is already in use. Please choose a different one.",
        });
      }
      user.email = email.toLowerCase();
    }

    // New password update
    if (newPassword) {
      if (newPassword.trim().length < 6) {
        return res
          .status(422)
          .json({ message: "Password must be at least 6 characters" });
      }
      if (newPassword !== confirmNewPassword) {
        return res.status(422).json({ message: "Passwords do not match" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Save updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user profile",
      error: error.message,
    });
  }
};

// Logout user
// GET /logout
const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.redirect("/login");
};

module.exports = {
  login,
  loginUser,
  getRegister,
  registerUser,
  home,
  getProfile,
  updateProfile,
  logout,
};
