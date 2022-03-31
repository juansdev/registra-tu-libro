"use strict"

const express = require("express");
const EditorialController = require("../controllers/editorial");
const router = express.Router();

//Rutas de Editorial
router.get("/editorials/:page?",EditorialController.getEditorials);
router.get("/editorial/:editorialId",EditorialController.getEditorial);
router.post("/editorial",EditorialController.save);
router.put("/editorial/:editorialId",EditorialController.update);
router.delete("/editorial/:editorialId", EditorialController.delete);

module.exports = router;