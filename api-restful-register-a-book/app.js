"use strict"

const express = require("express");

const app = express();

//Cargar rutas
const author_routes = require("./routes/author");
const editorial_routes = require("./routes/editorial");
const book_routes = require("./routes/book");

//Middleware - Convertir el cuerpo de las peticiones HTTP en JSON. 
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Solución de CORS
//Middleware - Configuración cabeceras y CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Prefijo de rutas
app.use("/api",author_routes);
app.use("/api",editorial_routes);
app.use("/api",book_routes);

//Exportar módulo
module.exports = app;