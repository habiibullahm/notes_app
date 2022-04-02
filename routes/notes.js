const express = require("express");
const {
  getNotes,
  createNotes,
  getNote,
  updateNotes,
  deleteNotes,
} = require("../controllers/notesController");

const { isLogin } = require("../middlewares/auth");
const router = express.Router();

router.get("/fetch", getNotes);
router.post("/create", isLogin, createNotes);
router.get("/fetch/detail", getNote);
router.put("/update/:id", isLogin, updateNotes);
router.delete("/delete/detail", isLogin, deleteNotes);

module.exports = router;
