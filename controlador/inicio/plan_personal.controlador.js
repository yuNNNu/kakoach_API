/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const plan = require('../../modelo/inicio/plan_personal.modelo')
const fs = require('fs');
const path = require('path');
/*=============================================
FUNCIÓN GET
=============================================*/
let showPlan = (req, res) =>
{
    //https://mongoosejs.com/docs/api.html#model_Model.find
    plan.find({})
        .exec((err, data) =>
        {
            console.log(data)
            if(err){

                return res.json({

                status:500,
                mensaje: "Error en la petición"

                })
            }

            //Contar la cantidad de registros
            plan.countDocuments({}, (err, total)=>{

            if(err){

                return res.json({

                status:500,
                mensaje: "Error en la petición"

                })
                }

                res.json({
                status: 200,
                total,
                data
                })

            })
        })
}

/*=============================================
FUNCIÓN PUT
=============================================*/
let updatePersonalPlan = (req, res) =>
{
    // caputaramos id de beneficio
    let id = req.params.id;
    // obtenemos el cuerpo del formulario
    let body = req.body;
        //01  VALIDAMOS EXISTENCIA DE BENEFICIO
        plan.findById(id, (err, data) =>
        {
         
        
             //Validammos que no haya error
            if (err) {
                return res.json({
                    status: 500,
                    mensaje: "Error en el servidor",
                    err
                })
            }
            //Validamos que la beneficio exista
            if (!data) {
                return res.json({
                    status: 404,
                    mensaje: "No existe el plan en la base de datos",
                    err
                })
            }
            // recepcion de datos a editar AQUI DEBE SER LA RUTA DE LA IMG
            let rutaImg = data.rutaImagen;
       
                // 02 VALIDAMOS QUE EXISTAN CAMBIOS
                let validarCambio = (body, rutaImg) =>
                {  
                //   solo valide que si es que no viene una foto
                    return new Promise((resolve, reject) =>
                    {
                        if (body.imagen == undefined)
                        {
                           resolve(rutaImg)
                        } else
                        {
                            rutaImg = body.imagen
                            resolve(rutaImg)
                       }
                  
                    })
                  
                }
                
                // 03 ACTUALIZAR REGISTROS
                let cambiarRegistroBD = (id, rutaImg, body) =>
                {
                    return new Promise((resolve, reject) =>
                    {
                        let datosplan = {
                            rutaImagen: rutaImg,
                            titulo: body.titulo,
                            descripcion: body.descripcion,
                            valor: body.valor
                        }
                        //Actualizamos en MongoDB
                        //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
                        plan.findByIdAndUpdate(id, datosplan, {
                            new: true, // Con esto me muestra lo que se guardo y no el antiguo
                            runValidators: true // Con esto me muestra lo que se guardo y no el antiguo           
                        }, (err, data) =>
                        {
                            if (err) {
                                let respuesta = {
                                res: res,
                                error: err
                                }
                                reject(respuesta);

                            }

                            let respuesta = {
                            res: res,
                            data: data
                            }    
                            resolve(respuesta)
                        })
                    })        
                }
                // 04 SINCRONIZANDO PROMESAS
                validarCambio(body, rutaImg).then((rutaImg) =>
                {
                    cambiarRegistroBD(id, rutaImg, body).then(respuesta =>
                    {
                        console.log("res",respuesta)
                        respuesta["res"].json({
                        status: 200,
                        data: respuesta["data"],
                        mensaje: "El plan personal ha sido actualizado con exito"
                        })
                    }).catch((respuesta =>
                    {
                        respuesta["err"].json({
                        status: 400,
                        err: respuesta["err"],
                        mensaje: "Error al editar el plan personal"
                        })
                    }))
                }).catch((respuesta =>
                {
                    respuesta["res"].json({
                    status: 400,
                    mensaje: respuesta["mensaje"]
                })
                }))
               
        })
}

let createData = (req, res) => {
    
    let body = req.body;

    if(!req.files){
        return res.json({
            status: 500,
            mensaje: "La imagen no puede ir vacía"
        })
    }

    let imagen = req.files.imagen;

    // SE VALIDAN LAS EXTENSIONES DE LA IMAGEN

    if(imagen.mimetype != 'image/jpeg' && imagen.mimetype != 'image/png' 
        && imagen.mimetype != 'image/JPEG' && imagen.mimetype != 'image/PNG'){

        return res.json({

            status:400,
            mensaje: "la imagen debe ser formato JPG o PNG"
            
        })
    }

    //Validamos el tamaño del imagen

    if(imagen.size > 2000000){

        return res.json({

            status:400,
            mensaje: "la imagen debe tener un peso inferior a 2MB" 
            
        })
    }

    //Cambiar nombre al archivo

    let nombre = Math.floor(Math.random()*10000);

    //Capturar la extensión del archivo

    let extension = imagen.name.split('.').pop();

    // Movemos la imagen a la carpeta

    imagen.mv(`./archivos/inicio/imgplanprincipal/${nombre}.${extension}`, err => {

        if(err){
            return res.json({
                status: 500,
                mensaje: "Error al guardar la imagen",
                err
            })
        }


        //Obtenemos los datos del formulario para pasarlos al modelo

        let datosPlan = new plan({
        
            imagen:`${nombre}.${extension}`,
            titulo:body.titulo,
            descripcion:body.descripcion,
            valor: body.valor,
            pros: body.pros

        })

        //Guardamos en MongoDB

        datosPlan.save((err, data)=>{

            if(err){

                return res.json({
                    status:400,
                    mensaje: "Error al almacenar la imagen principal, título y párrafo del módulo",
                    err
                })

            }

            res.json({

                status:200,
                data,
                mensaje:"El módulo ha sido creado con éxito"

            })

        })

    })
}

let mostrarImg = (req, res) => {
    let imagen = req.params.imagen;
    let rutaImagen = `./archivos/inicio/imgplanprincipal/${imagen}`;

    fs.exists(rutaImagen, exists => {
        if(!exists){
            return res.json({
                status: 400,
                mensaje: "La imagen no existe"
            })
        }

        res.sendFile(path.resolve(rutaImagen));

    })
}

/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    showPlan,
    updatePersonalPlan,
    createData,
    mostrarImg
}

