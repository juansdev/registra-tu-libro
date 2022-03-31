"use strict"

const express = require("express");
const AuthorController = require("../controllers/author");
const router = express.Router();

//Rutas de Autor
router.get("/authors/:page?",AuthorController.getAuthors);
router.get("/author/:authorId",AuthorController.getAuthor);
router.post("/author",AuthorController.save);
router.put("/author/:authorId",AuthorController.update);
router.delete("/author/:authorId", AuthorController.delete);

module.exports = router;