"use strict"

const moment = require("moment");
const { default: validator } = require("validator")
const Author = require("../models/author");
const Book = require("../models/book");

const controller = {
    //Metódo para crear un Autor
    save: function(req,res){
        //Recoger petición
        const params = req.body;
    
        //Validar datos
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_date_of_birth = !validator.isEmpty(params.date_of_birth);
            var validate_city_of_origin = !validator.isEmpty(params.city_of_origin);
        } catch (error) {
            return res.status(422).send({
                status:"error",
                message:"Faltan datos por envíar"
            });
        }

        //Si las validaciones obligatorias son correctas...
        if(validate_name && validate_email){

            //Crear un objeto de Author y asignarle valores
            let author = new Author();
            
            //Añadir datos obligatorios
            author.name = params.name;
            author.email = params.email.toLowerCase();//Para facilitar la consulta de un dato documento en concreto, los emails se guardaran en minúsculas.

            //Añadir datos opcionales si no esta vació...
            //Validar Fecha de nacimiento del Autor...
            if(validate_date_of_birth){
                validate_date_of_birth = moment(params.date_of_birth,"YYYY/MM/DD").format("DD/MM/YYYY");
                validate_date_of_birth = moment(validate_date_of_birth,"DD/MM/YYYY").isValid();
                if(!validate_date_of_birth) return res.status(422).send({
                    status:"error",
                    message:"La fecha de nacimiento del Autor no es valído"
                });
                else author.date_of_birth = moment(params.date_of_birth,"YYYY/MM/DD").format("DD/MM/YYYY");
            }
            if(validate_city_of_origin) author.city_of_origin = params.city_of_origin;

            //Comprobar si el Autor existe mediante su email
            Author.findOne({email: author.email}, (err, issetAuthor)=>{
                //Si se produce un error o el Autor ya existe...
                if(err) return res.status(500).send({
                    status:"error",
                    message:"Ocurrió un error al comprobar duplicidad del Autor.",
                    err
                });
                else if(issetAuthor) return res.status(200).send({
                    status:"error",
                    message:"El Autor ya se encuentra registrado."
                });
                //Si el Autor no existe...
                else{
                    //Guardar Autor
                    author.save((err, authorStored)=>{
                        if(err) return res.status(500).send({
                            status:"error",
                            message:"Ocurrió un error al guardar el Autor.",
                            err
                        });
                        else if(!authorStored) return res.status(200).send({
                            status:"error",
                            message:"El Autor no se logro guardar."
                        });
                        else return res.status(200).send({
                            status:"success",
                            author: authorStored
                        });
                    });//Cierre del save
                }
            });//Cierre comprobación de duplicidad
        }
        else return res.status(422).send({
            status:"error",
            message:"Los datos del Autor que intentas registrar no son valídos"
        });
    },
    //Metódo para actualizar un Autor
    update: function(req,res){
        //Recibir petición
        const params = req.body;

        //Validar datos obligatorios        
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_date_of_birth = !validator.isEmpty(params.date_of_birth);
            var validate_city_of_origin = !validator.isEmpty(params.city_of_origin);
        } catch (error) {
            return res.status(422).send({
                status:"error",
                message:"Faltan datos por envíar"
            });
        }

        //Si las validaciones obligatorias son correctas...
        if(validate_name && validate_email){

            //Validar dato opcional de la fecha de nacimiento, sí algún dato opcional esta vació dejar valor por defecto ("")...
            if(validate_date_of_birth){
                //Validar fecha de nacimiento del Autor si no esta vació
                validate_date_of_birth = validator.isDate(params.date_of_birth,{format:"DD-MM-YYYY"});
                if(!validate_date_of_birth) return res.status(422).send({
                    status:"error",
                    message:"La fecha de nacimiento del Autor no es valída."
                });
            }
            else params.date_of_birth = "";
            if(!validate_city_of_origin) params.city_of_origin = "";

            const topicId = req.params.authorId;

            //Buscar Email por ID del Autor
            Author.findById(topicId,(err,author)=>{
                if(err) return res.status(500).send({
                    status:"Error",
                    message:"Ocurrió un error al consultar el Autor"
                });
                else if(!author) return res.status(200).send({
                    status:"Error",
                    message:"La ID del Autor no se encuentra registrado"
                });
                else {
                    const author_original_email = author.email;
                    //Si el Email es diferente - Comprobar si el email no esté registrado en la BD.
                    if(author_original_email !== params.email){
                        //Buscar Autores que coincidan con el email
                        Author.findOne({email: params.email.toLowerCase()}, (err,author) => {
                            if(err) return res.status(500).send({
                                status:"error",
                                message:"Ocurrió un error al consultar el correo electrónico del Autor"
                            });
                            else if(author) return res.status(200).send({
                                status:"error",
                                message:"No se puede cambiar al correo electrónico envíado, debido a que ya se encuentra registrado"
                            });
                            else{
                                //Buscar y actualizar documento del Autor
                                Author.findOneAndUpdate({_id:topicId},params,{new:true},(err,authorUpdated)=>{
                                    if(err)return res.status(500).send({
                                        status:"error",
                                        message:"Ocurrió un error al actualizar el Autor"
                                    });
                                    else if(!authorUpdated)return res.status(200).send({
                                        status:"error",
                                        message:"El Autor no existe"
                                    });
                                    else return res.status(200).send({
                                        status:"success",
                                        author: authorUpdated
                                    });
                                });//Cerrar consulta de Autor por ID y actualizarlo con datos...
                            }
                        });//Cerrar consulta de Autores por Email
                    }
                    //Si no modificara sú Email...
                    //Buscar y actualizar documento del Autor
                    else Author.findOneAndUpdate({_id:topicId},params,{new:true},(err,authorUpdated)=>{
                        if(err)return res.status(500).send({
                            status:"error",
                            message:"Ocurrió un error al actualizar el Autor"
                        });
                        else if(!authorUpdated)return res.status(200).send({
                            status:"error",
                            message:"El Autor no existe"
                        });
                        else return res.status(200).send({
                            status:"success",
                            author: authorUpdated
                        });
                    });//Cerrar consulta de Autor por ID y actualizarlo con datos...
                }
            });//Cerrar consulta de Autor por ID
        }

        else return res.status(422).send({
            status:"error",
            message:"Los datos del Autor que intentas registrar no son valídos"
        });
    },
    //Metódo para listar todos los Autores
    getAuthors: function(req,res){
        //Cargar la librería de paginación en la clase. HECHO en el modelo Author.

        //Recoger la página actual
        const page = !req.params.page ? 1 : parseInt(req.params.page) ? parseInt(req.params.page) : 1;

        //Indicar las opciones de paginación
        const options = {
            sort: { date: -1 },//Ordenado de más nuevo a más viejo
            limit: 10,//Habra 10 authors por página
            page: page
        };

        //Buscar paginado
        Author.paginate({},options,(err,authors)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Ocurrió un error al listar los Autores"
            });
            else if(!authors) return res.status(200).send({
                status:"error",
                message:"No hay Autores registrados"
            });
            //Devolver resultado (authors, total de authors, total de paginas)
            else return res.status(200).send({
                status:"success",
                authors:authors.docs,
                totalDocs: authors.totalDocs,
                totalPage: authors.totalPages
            });
        });
    },
    //Metódo para listar un Autor
    getAuthor: function(req,res){
        //Recoger petición
        const authorId = req.params.authorId;
        //Comprobar si el Autor existe mediante su ID, y si existe devolver datos del Autor.
        Author.findById(authorId).exec((err,author)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Ocurrió un error al buscar el Autor"
            });
            else if(!author) return res.status(200).send({
                status:"error",
                message:"El Autor no existe"
            });
            else return res.status(200).send({
                status:"success",
                author
            });
        });
    },
    //Metódo para eliminar Autor
    delete: function(req,res){
        //Sacar el ID del author de la URL
        const authorId = req.params.authorId;
        //Encuentra y elimina el Author según el ID
        Author.findByIdAndDelete(authorId,(err,authorRemoved)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Ocurrió un error al eliminar el Autor"
            });
            else if(!authorRemoved) return res.status(404).send({
                status:"error",
                message:"No se ha borrado el Autor"
            });
            else {
                //Eliminar todos los libros relacionados con la ID del Autor
                Book.deleteMany({author:authorRemoved._id},(err,booksRemoved)=>{
                    if(err) return res.status(500).send({
                        status:"error",
                        message:"Ocurrió un error al eliminar los libros del Autor"
                    });
                    else if(!booksRemoved) return res.status(404).send({
                        status:"error",
                        message:"No se ha borrado los libros relacionados con el Autor"
                    });
                    else return res.status(200).send({
                        status:"success",
                        author:authorRemoved,
                        books:booksRemoved
                    });
                })
            };
        });
    },
}

module.exports = controller;