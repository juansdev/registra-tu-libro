"use strict"

const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3999;

//CONEXIÓN A LA BASE DE DATOS "register_a_book".

mongoose.set("useFindAndModify",false);//Conveniencia para evitar warnings durante ejecución.
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/register_a_book",{
    useNewUrlParser:true
}).then(
    ()=>{
        console.log("La conexión a la base de datos de mongo se ha realizado correctamente.");
        // Lanzamiento del servidor web
        app.listen(port,()=>{
            console.log("Servidor disponible en: http://localhost:"+port);
        });
    }
).catch(
    error => console.log(error)
);