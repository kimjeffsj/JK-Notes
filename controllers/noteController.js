const mainLayout = "../views/layouts/main.ejs";
const Note = require("../models/noteSchema");

// Get all notes
// GET /notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ creator: req.user._id }).sort({
      updatedAt: -1,
    });
    res.render("notes", { notes, layout: mainLayout });
  } catch (error) {
    res.status(500).render("notes", { message: "Failed to fetch notes" });
  }
};

// Get a single note
// GET /notes/:_id
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params._id,
      creator: req.user._id,
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.render("noteDetail", { note, layout: mainLayout });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch note" });
  }
};

// Create note page
// GET /create
const getCreateNote = (req, res) => {
  res.render("createNote", { layout: mainLayout });
};

// Create note
// POST /create
const createNote = async (req, res) => {
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
    res.status(500).res.render("createNote", {
      layout: mainLayout,
      message: "Failed to create note",
    });
  }
};

// Edit note page
// GET /notes/:_id/edit
const getEditNote = async (req, res) => {
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
    res.status(500).render("editNote", {
      layout: mainLayout,
      message: "Failed to fetch note",
    });
  }
};

// Edit note
// POST /notes/:_id/edit
const editNote = async (req, res) => {
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
    res.status(500).render("editNote", {
      layout: mainLayout,
      message: "Failed to update note",
    });
  }
};

// Delete note
// DELETE /notes/:_id
const deleteNote = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedNote = await Note.findOneAndDelete({
      _id: _id,
      creator: req.user._id,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete note" });
  }
};

module.exports = {
  getAllNotes,
  getNote,
  getCreateNote,
  createNote,
  getEditNote,
  editNote,
  deleteNote,
};
