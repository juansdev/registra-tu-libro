"use strict"

const validator = require("validator");
const Book = require("../models/book");
const Author = require("../models/author");
const Editorial = require("../models/editorial");

//Controladores
const ControllerAuthor = require("../controllers/author");
const ControllerEditorial = require("../controllers/editorial");
const { find } = require("../models/book");

const controller = {
    //Metódo para crear un Libro
    save: function(req,res){

        //Recoger petición
        const params = req.body;

        //Convertir valor númerico en String
        params.pages = String(params.pages);
    
        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_year = !validator.isEmpty(params.year) && validator.isNumeric(params.year);
            var validate_gender = !validator.isEmpty(params.gender);
            var validate_pages = !validator.isEmpty(params.pages) && validator.isNumeric(params.pages);
            var validate_author_id = !validator.isEmpty(params.author_id);
            var validate_editorial_id = !validator.isEmpty(params.editorial_id);
        } catch (error) {
            return res.status(422).send({
                status:"error",
                message:"Faltan datos por envíar"
            });
        }

        //Si las validaciones son correctas...
        if(validate_title && validate_year && validate_gender && validate_pages && validate_author_id && validate_editorial_id){
            //Recoger el ID del Author y Editorial
            const authorId = params.author_id;
            const editorialId = params.editorial_id;

            //Validar si Autor existe
            Author.findById(authorId,(err,author)=>{
                if(err) return res.status(500).send({
                    status:"error",
                    message:"Ocurrió un error al consultar el Autor",
                    err
                });
                else if(!author) return res.status(200).send({
                    status:"error",
                    message:"El Autor no está registrado"
                });
                //Si el Autor existe...
                else{
                    //Validar si Editorial existe
                    Editorial.findById(editorialId,(err,editorial)=>{
                        if(err) return res.status(500).send({
                            status:"error",
                            message:"Ocurrió un error al consultar la Editorial",
                            err
                        });
                        else if(!editorial) return res.status(200).send({
                            status:"error",
                            message:"La Editorial no está registrada"
                        });
                        //Si la Editorial existe...
                        else{
                            //Guardar límite de libros permitidos para registrar...
                            let maximum_books_registered = editorial.maximum_books_registered;
                            
                            //Crear un objeto de Book y asignarle valores
                            let book = new Book();
                                
                            //Añadir datos obligatorios
                            book.title = params.title;
                            book.year = params.year;
                            book.gender = params.gender;
                            book.pages = params.pages;
                            book.author = authorId;
                            book.editorial = editorialId;
                            
                            //Comprobar si la Editorial tiene un límite de libros para registrar...
                            if(maximum_books_registered>0){
                                //Comprobar cuantos libros tiene la Editorial
                                Book.find({"editorial":editorialId},(err,books)=>{
                                    if(err) return res.status(500).send({
                                        status:"error",
                                        message:"Ocurrió un error al consultar los Libros según ID de Editorial",
                                        err
                                    });
                                    else if(!editorial) return res.status(200).send({
                                        status:"error",
                                        message:"No hay libros registrados con la ID de la Editorial"
                                    });
                                    else{
                                        //Si la capacidad máxima de libros supera a la cantidad de libros registrados...
                                        if(maximum_books_registered > books.length){
                                            //Guardar el Libro
                                            book.save((err, bookStored)=>{
                                                if(err) return res.status(500).send({
                                                    status:"error",
                                                    message:"Ocurrió un error al guardar el Libro",
                                                    err
                                                });
                                                else if(!bookStored) return res.status(200).send({
                                                    status:"error",
                                                    message:"El Libro no se logro guardar"
                                                });
                                                else return res.status(200).send({
                                                    status:"success",
                                                    book: bookStored
                                                });
                                            });//Cierre del save
                                        }
                                        else return res.status(200).send({
                                            status:"error",
                                            message:"No es posible registrar el libro, se alcanzó el máximo permitido.",
                                            maximum_books_registered:maximum_books_registered,
                                            booksLen:books.length
                                        });
                                    }
                                });
                            }
                            else if(maximum_books_registered===-1){
                                //Si no hay límite de registro de libros...
                                //Guardar el Libro
                                book.save((err, bookStored)=>{
                                    if(err) return res.status(500).send({
                                        status:"error",
                                        message:"Ocurrió un error al guardar el Libro",
                                        err
                                    });
                                    else if(!bookStored) return res.status(200).send({
                                        status:"error",
                                        message:"El Libro no se logro guardar"
                                    });
                                    else return res.status(200).send({
                                        status:"success",
                                        book: bookStored
                                    });
                                });//Cierre del save
                            }
                            else return res.status(200).send({
                                status:"error",
                                message:"No es posible registrar el libro, se alcanzó el máximo permitido."
                            });
                        }
                    });//Cierre consulta de Editorial por Id
                }
            });//Cierre consulta de Author por Id
        }
        else return res.status(422).send({
            status:"error",
            message:"Los datos del Libro que intentas registrar no son valídos"
        });
    },
    //Metódo para listar todos los Libro
    getBooks: function(req,res){
        //Cargar la librería de paginación en la clase. HECHO en el modelo Book.

        //Recoger la página actual
        const page = !req.params.page ? 1 : parseInt(req.params.page) ? parseInt(req.params.page) : 1;

        //Indicar las opciones de paginación
        const options = {
            sort: { date: -1 },//Ordenado de más nuevo a más viejo
            populate: ["author","editorial"],//Carga el objeto documento completo del Author con la ID registrada.
            limit: 10,//Habra 10 books por página
            page: page
        };

        //Buscar paginado
        Book.paginate({},options,(err, books)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Ocurrió un error al consultar los Libros"
            });
            else if(!books) return res.status(200).send({
                status:"notfound",
                message:"No hay libros registrados"
            });
            //Devolver resultado (books, total de books, total de paginas)
            else return res.status(200).send({
                status:"success",
                books:books.docs,
                totalDocs: books.totalDocs,
                totalPage: books.totalPages
            });
        });
    },
    //Metódo para listar los Libros de un Autor
    getBooksByAuthor: function(req,res){
        //Conseguir el ID del Autor
        const authorId = req.params.authorId;

        //Recoger la página actual
        const page = !req.params.page ? 1 : parseInt(req.params.page) ? parseInt(req.params.page) : 1;

        //Indicar las opciones de paginación
        const options = {
            sort: { date: -1 },//Ordenado de más nuevo a más viejo
            populate: ["author","editorial"],//Carga el objeto documento completo del Author con la ID registrada.
            limit: 10,//Habra 10 books por página
            page: page
        };

        if (authorId){
            //Encontrar Libro con la ID del Autor - Con Paginado
            Book.paginate({author:authorId},options,(err,books)=>{
                    if(err) return res.status(500).send({
                        status:"error",
                        message:"Ocurrió un error al consultar los Libros según ID del Autor"
                    });
                    else if (!books) return res.status(200).send({
                        status:"error",
                        message:"El Autor no tiene libros registrados"
                    });
                    //Devolver resultado (books, total de books, total de paginas)
                    else return res.status(200).send({
                        status:"success",
                        books:books.docs,
                        totalDocs: books.totalDocs,
                        totalPage: books.totalPages
                    });
                }
            );
        }
    },
    //Metódo para listar los Libros de una Editorial,
    getBooksByEditorial: function(req,res){
        //Conseguir el ID de la Editorial
        const editorialId = req.params.editorialId;

        //Recoger la página actual
        const page = !req.params.page ? 1 : parseInt(req.params.page) ? parseInt(req.params.page) : 1;

        //Indicar las opciones de paginación
        const options = {
            sort: { date: -1 },//Ordenado de más nuevo a más viejo
            populate: ["author","editorial"],//Carga el objeto documento completo del Author con la ID registrada.
            limit: 10,//Habra 10 books por página
            page: page
        };

        if (editorialId){
            //Encontrar Libro con la ID de la Editorial
            Book.paginate({editorial:editorialId},options,(err,books)=>{
                if(err) return res.status(500).send({
                    status:"error",
                    message:"Ocurrió un error al consultar los Libros según ID de la Editorial"
                });
                else if (!books) return res.status(200).send({
                    status:"error",
                    message:"La Editorial no tiene libros registrados"
                });
                //Devolver un resultado
                else return res.status(200).send({
                    status:"success",
                    books:books.docs,
                    totalDocs: books.totalDocs,
                    totalPage: books.totalPages
                });
            });
        }
    },
    //Metódo para listar un Libro
    getBook: function(req,res){
        //Sacar el ID del Book de la URL
        var bookId = req.params.bookId;
        //Find por ID del topic
        Book.findById(bookId)
             .populate("editorial")
             .populate("author")
             .exec((err,book)=>{
                 if(err) return res.status(500).send({
                    status:"error",
                    message:"Ocurrió un error al consultar el Libro según ID"
                });
                else if (!book) return res.status(200).send({
                    status:"error",
                    message:"El libro no existe"
                });
                //Devolver un resultado
                else return res.status(200).send({
                    status:"success",
                    book
                });
             });
    },
    update: function(req,res){
        //Recoger el ID del topic de la url
        const bookId = req.params.bookId;

        //Recoger los datos del req
        const params = req.body;

        //Convertir valor númerico en String
        params.pages = String(params.pages);

        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_year = !validator.isEmpty(params.year) && validator.isNumeric(params.year);
            var validate_gender = !validator.isEmpty(params.gender);
            var validate_pages = !validator.isEmpty(params.pages) && validator.isNumeric(params.pages);
            var validate_author = !validator.isEmpty(params.author_id);
            var validate_editorial = !validator.isEmpty(params.editorial_id);
        } catch (error) {
            return res.status(422).send({
                status:"error",
                message:"Faltan datos por envíar",
                params
            });
        }
        //Si las validaciones son correctas...
        if(validate_title && validate_year && validate_gender && validate_pages && validate_author && validate_editorial){
            //Montar un JSON con los datos a modificar en la bd
            const update = {
                title: params.title,
                year: params.year,
                gender: params.gender,
                pages: params.pages,
                author: params.author_id,
                editorial: params.editorial_id
            };

            //Encuentra y actualiza el Libro según ID con datos del objeto "update"
            Book.findByIdAndUpdate(bookId,update,{new:true},(err,bookUpdated)=>{
                if(err) return res.status(500).send({
                    status:"error",
                    message:"Ocurrió un error al actualizar el Libro"
                });
                else if(!bookUpdated) return res.status(200).send({
                    status:"error",
                    message:"El libro no ha sido actualizado"
                });
                else return res.status(200).send({
                    status:"success",
                    book: bookUpdated
                });
            });
        }
        else return res.status(422).send({
            status:"error",
            message:"Los datos del Libro que intentas actualizar no son valídos"
        });
    },
    //Metódo para eliminar Libro
    delete: function(req,res){
        //Sacar el ID del topic de la URL
        const bookId = req.params.bookId;
        //Encuentra y elimina el Book según el ID
        Book.findByIdAndDelete(bookId,(err,bookRemoved)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Ocurrió un error al eliminar el Libro"
            });
            else if(!bookRemoved) return res.status(404).send({
                status:"error",
                message:"No se ha borrado el Libro"
            });
            else return res.status(200).send({
                status:"success",
                book:bookRemoved
            });
        });
    },
    //Metódo para buscar un Libro
    search: function(req,res){
        //Sacar String a buscar de la URL
        const searchString = req.params.search;

        //Encuentra según busqueda en el modelo Book
        Book.find({
            "$or":[ 
                {"title":{"$regex":searchString,"$options":"i"}},
                {"year":{"$regex":searchString}},
                {"gender":{"$regex":searchString,"$options":"i"}},
            ]
        })
        .populate("author")
        .populate("editorial")
        .sort([["title","descending"]])
        .exec(async (err,books)=>{
            if(err)return res.status(500).send({
                status: "error",
                message:"Ocurrió un error al consultar los Libros",
                err
            });
            else if(!books) var matchByBook = {};
            else var matchByBook = books;

            //Encuentra según busqueda en el modelo Author y Editorial
            //Obtener ID del Autor, si coincide...
            let matchByAuthor = await Author.find({
                "$or":[
                    {"name":{"$regex":searchString,"$options":"i"}}
            ]});

            let bookMatchByAuthor = [];
            
            //Si el nombre del Autor existe, comprobar si hay libros a su nombre...
            if(matchByAuthor.length>0){
                for (let index = 0; index < matchByAuthor.length; index++) {
                    let authorId = matchByAuthor[index]._id;
                    let isBookMatchByAuthor = await Book.find({author:authorId})
                    .populate("author")
                    .populate("editorial")
                    .sort([["title","descending"]]);
                    //Si ese Autor tiene libros a su nombre, añadirlo...
                    if(isBookMatchByAuthor.length>0){
                        for (let index = 0; index < isBookMatchByAuthor.length; index++) {
                            bookMatchByAuthor.push(isBookMatchByAuthor[index]);
                        }
                    }
                }
            }

            //Obtener ID de la Editorial, si coincide...
            let matchByEditorial = await Editorial.find({
                "$or":[
                    {"name":{"$regex":searchString,"$options":"i"}}
                ]
            });

            let bookMatchByEditorial = [];
            
            //Si el nombre de la Editorial existe, comprobar si hay libros registrados en su Editorial...
            if(matchByEditorial.length>0){
                for (let index = 0; index < matchByEditorial.length; index++) {
                    let editorialId = matchByEditorial[index]._id;
                    let isBookMatchByEditorial = await Book.find({editorial:editorialId})
                    .populate("author")
                    .populate("editorial")
                    .sort([["title","descending"]]);
                    //Si esa Editorial tiene libros registrados, añadirlo...
                    if(isBookMatchByEditorial.length>0){
                        for (let index = 0; index < isBookMatchByEditorial.length; index++) {
                            bookMatchByEditorial.push(isBookMatchByEditorial[index]);
                        }
                    };
                }
            }
                
            //Devolver respuesta con todas las coincidencias
            return res.status(200).send({
                bookMatchByAuthor,
                bookMatchByEditorial,
                matchByBook:matchByBook
            });

        });
    }
}

module.exports = controller;