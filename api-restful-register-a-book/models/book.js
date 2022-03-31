"use strict"

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

//Esquema de la colección de datos Books
const BookSchema = Schema({
    title: String,
    year: String,
    gender: String,
    pages: Number,
    author:{type: Schema.ObjectId, ref:"Author"},
    editorial:{type: Schema.ObjectId, ref:"Editorial"}
});

//Cargar plugin de paginación al Esquema.
BookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Book",BookSchema);