const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const Note = require("../models/noteSchema");

router.get(["/", "/home"], (req, res) => {
  res.render("index", { layout: mainLayout });
});

router.get("/about", (req, res) => {
  res.render("about", { layout: mainLayout });
});

router.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.render("notes", { notes, layout: mainLayout });
});

// GET NOTE DETAIL
// GET /notes/:id
router.get("/notes/:id", async (req, res) => {
  const note = await Note.findById({ _id: req.params.id });
  res.render("noteDetail", { note, layout: mainLayout });
});

// POST CREATE A NOTE
// POST /notes
router.post("/notes", async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.redirect("/notes");
});

module.exports = router;
