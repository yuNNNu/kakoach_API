/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const plan = require('../../modelo/inicio/plan_personal.modelo')
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


/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    showPlan,
    updatePersonalPlan
}

