"use strict"

const express = require("express");
const BookController = require("../controllers/book");

const router = express.Router();

//Rutas de Libro
router.get("/books/:page?", BookController.getBooks);
router.get("/book/:bookId",BookController.getBook);
router.get("/author-books/:authorId/:page?",BookController.getBooksByAuthor);
router.get("/editorial-books/:editorialId/:page?",BookController.getBooksByEditorial);
router.get("/search/:search", BookController.search);
router.post("/book",BookController.save);
router.put("/book/:bookId",BookController.update);
router.delete("/book/:bookId", BookController.delete);

module.exports = router;