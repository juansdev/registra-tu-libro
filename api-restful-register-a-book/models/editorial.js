"use strict"

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

//Esquema de la colección de datos Editorials
const EditorialSchema = Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
    maximum_books_registered: {type: Number, default: -1}
});

//Cargar plugin de paginación al Esquema.
EditorialSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Editorial", EditorialSchema);