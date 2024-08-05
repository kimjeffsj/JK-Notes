const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const Note = require("../models/noteSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// Middleware
router.use(cookieParser());

// Authentication middleware
function isAuth(req, res, next) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.redirect("/login").json({ message: "Login First please" });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET);
    req.user = { _id: decoded.id };
    next();
  } catch (error) {
    res.clearCookie("accessToken");
    return res.redirect("/login");
  }
}

// Routes
router.get("/", (req, res) => {
  res.render("index", { layout: mainLayout });
});

// GET LOGIN PAGE
router.get("/login", async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.SECRET);
      return res.redirect("/home");
    } catch (error) {
      // Token is invalid, clear it
      res.clearCookie("accessToken");
    }
  }
  res.render("login", { layout: mainLayout });
});

// GET HOME
router.get("/home", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Something wrong fetching data" });
    }
    res.render("home", { user, layout: mainLayout });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST LOGIN USER
router.post("/login", async (req, res) => {
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
});

// GET REGISTER PAGE
router.get("/register", (req, res) => {
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
});

// POST REGISTER USER
router.post("/register", async (req, res) => {
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
    console.error(error);
    res.status(500).json({ message: "User registration failed" });
  }
});

// GET ALL NOTES
router.get("/notes", isAuth, async (req, res) => {
  try {
    const notes = await Note.find({ creator: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("notes", { notes, layout: mainLayout });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).render("notes", { message: "Failed to fetch notes" });
  }
});

// GET NOTE DETAIL
router.get("/notes/:_id", isAuth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params._id,
      creator: req.user._id,
    });
    if (!note) {
      return res.status(404).render("error", {
        message: "Note not found",
        layout: mainLayout,
      });
    }
    res.render("noteDetail", { note, layout: mainLayout });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).render("error", {
      message: "Error fetching note",
      layout: mainLayout,
    });
  }
});

// GET CREATE A NOTE PAGE
router.get("/create", isAuth, (req, res) => {
  res.render("createNote", { layout: mainLayout });
});

// POST CREATE A NOTE
router.post("/create", isAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).res.render("createNote", {
        layout: mainLayout,
        error: "Please fill in all fields",
      });
    }
    const newNote = await Note.create({
      title,
      content,
      creator: req.user._id,
    });
    res.redirect("/notes");
  } catch (error) {
    console.error("Failed to create note:", error);
    res.status(500).res.render("createNote", {
      layout: mainLayout,
      message: "Failed to create note",
    });
  }
});

// EDIT NOTE
// GET /notes/:_id/edit
router.get("/notes/:_id/edit", isAuth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params._id,
      creator: req.user._id,
    });
    if (!note) {
      return res.status(404).render("editNote", {
        layout: mainLayout,
        message: "Note not found or you're not authorized to edit it",
      });
    }

    res.render("editNote", { layout: mainLayout, note: note });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).render("editNote", {
      layout: mainLayout,
      message: "Failed to fetch note",
    });
  }
});

// EDIT NOTE
// POST /notes/:_id/edit
router.post("/notes/:id/edit", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, creator: req.user._id },
      { title, content, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).render("notes", {
        layout: mainLayout,
        message: "Note not found or you're not authorized to edit it",
      });
    }

    res.redirect("/notes/" + id);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).render("editNote", {
      layout: mainLayout,
      message: "Failed to update note",
    });
  }
});

// GET PROFILE PAGE
router.get("/profile/:_id", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.render("profile", { user, layout: mainLayout });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.redirect("/login");
});

module.exports = router;
