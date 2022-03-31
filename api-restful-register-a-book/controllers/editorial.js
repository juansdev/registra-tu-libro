"use strict"

const { default: validator } = require("validator")
const Editorial = require("../models/editorial");
const Book = require("../models/book");

const controller = {
    //Metódo para crear una Editorial
    save: function(req,res){
        //Recoger petición
        const params = req.body;

        //Convertir valor númerico en String
        params.maximum_books_registered = String(params.maximum_books_registered);

        //Validar datos obligatorios
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_address = !validator.isEmpty(params.address);
            var validate_phone = !validator.isEmpty(params.phone);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_maximum_books_registered = !validator.isEmpty(params.maximum_books_registered);
        } catch (error) {
            return res.status(422).send({
                status:"error",
                message:"Faltan datos por envíar"
            });
        }

        //Si las validaciones obligatorias son correctas...
        if(validate_name && validate_address && validate_phone && validate_email){

            //Crear un objeto de Editorial y asignarle valores
            let editorial = new Editorial();

            //Añadir datos obligatorios
            editorial.name = params.name;
            editorial.address = params.address;
            editorial.phone = params.phone;
            editorial.email = params.email.toLowerCase();//Para facilitar la consulta de un dato documento en concreto, los emails se guardaran en minúsculas.

            //Validación dato opcional y añadirlo si es valído...
            if(validate_maximum_books_registered){
                validate_maximum_books_registered = validator.isNumeric(params.maximum_books_registered);
                if(!validate_maximum_books_registered) return res.status(422).send({
                    status:"error",
                    message:"El dato del límite de libros registrados debe de ser de tipo numérico"
                });
                else {
                    const int_maximum_books_registered = parseInt(params.maximum_books_registered);
                    //El límite de libros registrados debe de ser -1 o superior a este...
                    if(int_maximum_books_registered>0 || int_maximum_books_registered==-1) editorial.maximum_books_registered = params.maximum_books_registered;
                    else return res.status(422).send({
                        status:"error",
                        message:"El dato del límite de libros registrados debe de ser igual a -1 o mayor a 0."
                    });
                };
            }

            //Comprobar si la editorial existe mediante su email
            Editorial.findOne({email: editorial.email}, (err, issetEditorial)=>{
                //Si se produce un error o la Editorial ya existe...
                if(err) return res.status(500).send({
                    status:"error",
                    message:"Ocurrió un error al comprobar duplicidad de la Editorial.",
                    err
                });
                else if(issetEditorial) return res.status(200).send({
                    status:"error",
                    message:"La Editorial ya se encuentra registrado."
                });
                //Si la Editorial no existe...
                else{
                    //Guardar Editorial
                    editorial.save((err, editorialStored)=>{
                        if(err) return res.status(500).send({
                            status:"error",
                            message:"Ocurrió un error al guardar la Editorial.",
                            err
                        });
                        else if(!editorialStored) return res.status(200).send({
                            status:"error",
                            message:"La Editorial no se logro guardar."
                        });
                        else return res.status(200).send({
                            status:"success",
                            editorial: editorialStored
                        });
                    });//Cierre del save
                }
            });//Cierre comprobación de duplicidad
        }
        else return res.status(422).send({
            status:"error",
            message:"Los datos de la Editorial que intentas registrar no son valídos"
        });
    },
    //Metódo para actualizar una Editorial
    update: function(req,res){
        //Recibir petición
        const params = req.body;

        //Convertir valor númerico en String
        params.maximum_books_registered = String(params.maximum_books_registered);

        //Validar datos obligatorios
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_address = !validator.isEmpty(params.address);
            var validate_phone = !validator.isEmpty(params.phone);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_maximum_books_registered = !validator.isEmpty(params.maximum_books_registered);
        } catch (error) {
            return res.status(422).send({
                status:"error",
                message:"Faltan datos por envíar"
            });
        }

        //Sí las validaciones obligatorias son correctas...
        if(validate_name && validate_address && validate_phone && validate_email){

            //Validación dato opcional del límite de libros registrados, sí esta vació dejar valor por defecto (-1)...
            if(validate_maximum_books_registered){
                validate_maximum_books_registered = validator.isNumeric(params.maximum_books_registered);
                //Validar sí límite de libros registrado es de tipo numérico
                if(!validate_maximum_books_registered) return res.status(422).send({
                    status:"error",
                    message:"El dato del límite de libros registrados debe de ser de tipo numérico"
                });
                else{
                    const int_maximum_books_registered = parseInt(params.maximum_books_registered);
                    //El límite de libros registrados debe de ser -1 o superior a este...
                    if(int_maximum_books_registered<=0 && int_maximum_books_registered!=-1) return res.status(422).send({
                        status:"error",
                        message:"El dato del límite de libros registrados debe de ser igual a -1 o mayor a 0."
                    });
                }
            }
            else params.maximum_books_registered = -1;
            
            const editorialId = req.params.editorialId;

            //Buscar Email por ID de la Editorial
            Editorial.findById(editorialId,(err,editorial)=>{
                if(err) return res.status(500).send({
                    status:"Error",
                    message:"Ocurrió un error al consultar la Editorial"
                });
                else if(!editorial) return res.status(200).send({
                    status:"Error",
                    message:"La ID de la Editorial no se encuentra registrado"
                });
                else {
                    const editorial_original_email = editorial.email;
                    //Si el Email es diferente - Comprobar si el email no esté registrado en la BD.
                    if(editorial_original_email !== params.email){
                        //Buscar editoriales que coincidan con el email
                        Editorial.findOne({email: params.email.toLowerCase()}, (err,editorial) => {
                            if(err) return res.status(500).send({
                                status:"error",
                                message:"Ocurrió un error al consultar el correo electrónico de la Editorial"
                            });
                            else if(editorial) return res.status(200).send({
                                status:"error",
                                message:"No se puede cambiar al correo electrónico envíado, debido a que ya se encuentra registrado"
                            });
                            else{
                                //Buscar y actualizar documento de la Editorial
                                Editorial.findOneAndUpdate({_id:editorialId},params,{new:true},(err,editorialUpdate)=>{
                                    if(err)return res.status(500).send({
                                        status:"error",
                                        message:"Ocurrió un error al actualizar la Editorial"
                                    });
                                    else if(!editorialUpdate)return res.status(200).send({
                                        status:"error",
                                        message:"La Editorial no existe"
                                    });
                                    else return res.status(200).send({
                                        status:"success",
                                        editorial: editorialUpdate
                                    });
                                });//Cerrar consulta de Editorial por ID y actualizarlo con datos...
                            }
                        });//Cerrar consulta de Editoriales por Email
                    }
                    //Si no modificara sú Email...
                    //Buscar y actualizar documento de la Editorial
                    else Editorial.findOneAndUpdate({_id:editorialId},params,{new:true},(err,editorialUpdate)=>{
                        if(err)return res.status(500).send({
                            status:"error",
                            message:"Ocurrió un error al actualizar la Editorial"
                        });
                        else if(!editorialUpdate)return res.status(200).send({
                            status:"error",
                            message:"La Editorial no existe"
                        });
                        else return res.status(200).send({
                            status:"success",
                            editorial: editorialUpdate
                        });
                    });//Cerrar consulta de Editorial por ID y actualizarlo con datos...
                }
            });//Cerrar consulta de Editorial por ID
        }

        else return res.status(422).send({
            status:"error",
            message:"Los datos de la Editorial que intentas registrar no son valídos"
        });
    },
    //Metódo para listar todas las Editoriales
    getEditorials: function(req,res){
        //Cargar la librería de paginación en la clase. HECHO en el modelo Editorial.
        
        //Recoger la página actual
        const page = !req.params.page ? 1 : parseInt(req.params.page) ? parseInt(req.params.page) : 1;

        //Indicar las opciones de paginación
        const options = {
            sort: { date: -1 },//Ordenado de más nuevo a más viejo
            limit: 10,//Habra 10 authors por página
            page: page
        };

        //Buscar paginado
        Editorial.paginate({},options,(err,editorials)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Ocurrió un error al listar las Editoriales"
            });
            else if(!editorials) return res.status(200).send({
                status:"error",
                message:"No hay Editoriales registrados"
            });
            //Devolver resultado (editorials, total de editorials, total de paginas)
            else return res.status(200).send({
                status:"success",
                editorials:editorials.docs,
                totalDocs: editorials.totalDocs,
                totalPage: editorials.totalPages
            });
        });
    },
    //Metódo para listar una Editorial
    getEditorial: function(req,res){
        //Recoger petición
        const editorialId = req.params.editorialId;
        //Comprobar si la Editorial existe mediante su ID, y si existe devolver datos del Editorial.
        Editorial.findById(editorialId).exec((err,editorial)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Ocurrió un error al buscar la Editorial"
            });
            else if(!editorial) return res.status(200).send({
                status:"error",
                message:"La editorial no existe"
            });
            else return res.status(200).send({
                status:"success",
                editorial
            });
        });
    },
    //Metódo para eliminar Editorial
    delete: function(req,res){
        //Sacar el ID de la editorial de la URL
        const editorialId = req.params.editorialId;
        //Encuentra y elimina el Author según el ID
        Editorial.findByIdAndDelete(editorialId,(err,editorialRemoved)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Ocurrió un error al eliminar la Editorial"
            });
            else if(!editorialRemoved) return res.status(404).send({
                status:"error",
                message:"No se ha borrado la Editorial"
            });
            else {
                //Eliminar todos los libros relacionados con la ID de la Editorial
                Book.deleteMany({editorial:editorialRemoved._id},(err,booksRemoved)=>{
                    if(err) return res.status(500).send({
                        status:"error",
                        message:"Ocurrió un error al eliminar los libros de la Editorial"
                    });
                    else if(!booksRemoved) return res.status(404).send({
                        status:"error",
                        message:"No se ha borrado los libros relacionados con la Editorial"
                    });
                    else return res.status(200).send({
                        status:"success",
                        editorial:editorialRemoved,
                        books:booksRemoved
                    });
                });
            }
        });
    },
}

module.exports = controller;