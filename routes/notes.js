const express = require("express");
const { getNotes, createNotes, getNote } = require("../controllers/notesController");

const { isLogin } = require("../middlewares/auth");
const router = express.Router();

router.get("/fetch", getNotes);
router.post("/create", isLogin, createNotes);
router.get("/fetch/detail", getNote);

module.exports = router;
