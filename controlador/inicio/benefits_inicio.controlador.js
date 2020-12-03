/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const benefits = require('../../modelo/inicio/benefits_inicio.modelo')

/*=============================================
ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
=============================================*/
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');

/*=============================================
FUNCIÓN GET
=============================================*/

let showBenefits = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	benefits.find({})
        .exec((err, data) =>
        {
           

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		benefits.countDocuments({}, (err, total)=>{

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


let updateBenefits = (req, res) =>
{
    // caputaramos id de beneficio
    let id = req.params.id;
    // obtenemos el cuerpo del formulario
    let body = req.body;
        //01  VALIDAMOS EXISTENCIA DE BENEFICIO
        benefits.findById(id, (err, data) =>
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
                    mensaje: "No existe la galeria en la base de datos",
                    err
                })
            }
            // recepcion de datos a editar
            let titulo = data.titulo;
            let descripcion = data.descripcion;
                // 02 VALIDAMOS QUE EXISTAN CAMBIOS
                let validarCambio = (body, titulo, descripcion) =>
                {
                        console.log(body)
                    return new Promise((resolve, reject) =>
                    {
                        if (body.descripcion == undefined && body.titulo == undefined)
                        {
                            reject(titulo, descripcion)
                        
                        } else if (body.descripcion == undefined)
                        {
                            reject(descripcion)
                            titulo = body.titulo;
                            resolve(titulo)
                        } else if(body.titulo == undefined){
                            reject(titulo)
                            descripcion = body.descripcion;
                            resolve(descripcion)
                        } else
                        {
                            descripcion = body.descripcion;
                            titulo = body.titulo;
                               resolve(titulo, descripcion)
                        }

                       
                     
                    })
                  
                }
                
                // 03 ACTUALIZAR REGISTROS
                let cambiarRegistroBD = (id, titulo, descripcion) =>
                {
                    return new Promise((resolve, reject) =>
                    {
                        let datosBenefits = {
                            titulo: body.titulo,
                            descripcion: body.descripcion
                        }
                        //Actualizamos en MongoDB
                        //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
                        benefits.findByIdAndUpdate(id, datosBenefits, {
                            new: true, // Con esto me muestra lo que se guardo y no el antiguo
                            runValidators: true // Con esto me muestra lo que se guardo y no el antiguo           
                        }, (err, data) =>
                        {
                            if (err) {
                                let respuesta = {
                                res: res,
                                error: error
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
                validarCambio(body, titulo, descripcion).then((titulo, descripcion) =>
                {
                    cambiarRegistroBD(id, titulo, descripcion).then(respuesta =>
                    {
                        respuesta["res"].json({
                        status: 200,
                        data: respuesta["data"],
                        mensaje: "El beneficio ha sido actualizado con exito"
                        })
                    }).catch((respuesta =>
                    {
                        respuesta["err"].json({
                        status: 400,
                        err: respuesta["err"],
                        mensaje: "Error al editar el Beneficio"
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
    showBenefits,
    updateBenefits
}