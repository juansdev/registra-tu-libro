"use strict"

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

//Esquema de la colección de datos Authors
const AuthorSchema = Schema({
    name: String,
    date_of_birth: { type:String, default:"" },//El formato de fecha será: DD-MM-YYYY
    city_of_origin: { type:String, default:"" },
    email: String
});

//Cargar plugin de paginación al Esquema.
AuthorSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Author", AuthorSchema);