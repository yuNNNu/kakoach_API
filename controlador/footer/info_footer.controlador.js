/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const footer = require('../../modelo/footer/info_footer.modelo')

/*=============================================
ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
=============================================*/
// const fs = require('fs');
// const { resolve } = require('path');
// const { rejects } = require('assert');

/*=============================================
PETICION GET
=============================================*/

let showData = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	footer.find({})
        .exec((err, data) =>
        {
           

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		footer.countDocuments({}, (err, total)=>{

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
PETICION PUT
=============================================*/

let updateData = (req, res) =>  {

    // caputaramos id de beneficio
    let id = req.params.id;
    // obtenemos el cuerpo del formulario
    let body = req.body;
        //01  VALIDAMOS EXISTENCIA DE BENEFICIO
        footer.findById(id, (err, data) =>
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
                    mensaje: "No existe el módulo en la base de datos",
                    err
                })
            }
            // recepcion de datos a editar
            let titulo = data.titulo;
       
                // 02 VALIDAMOS QUE EXISTAN CAMBIOS, SOLO VALIDE EL TITULO PQ NOSE SI TIRA PROBLEMA CON  EL REVOLVE CON DOS VARIABLES
                let validarCambio = (body, titulo) => {  
                    return new Promise((resolve, reject) =>
                    {
                        if (body.titulo == undefined)
                        {
                           resolve(titulo)
                        } else
                        {
                            titulo = body.titulo
                            resolve(titulo)
                       }
                    })
                }
                
                // 03 ACTUALIZAR REGISTROS
                let cambiarRegistroBD = (id, titulo, descripcion) => {
                    return new Promise((resolve, reject) => {

                        let datosfooter = {
                            titulo: titulo,
                            descripcion: body.descripcion
                        }
                        //Actualizamos en MongoDB
                        //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
                        footer.findByIdAndUpdate(id, datosfooter, {
                            new: true, // Con esto me muestra lo que se guardo y no el antiguo
                            runValidators: true // Con esto me muestra lo que se guardo y no el antiguo           
                        }, (err, data) => {
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
                validarCambio(body, titulo).then((titulo) =>
                {
                    cambiarRegistroBD(id, titulo, body).then(respuesta =>
                    {
                        respuesta["res"].json({
                        status: 200,
                        data: respuesta["data"],
                        mensaje: "El módulo ha sido actualizado con exito"
                        })
                    }).catch((respuesta =>
                    {
                        respuesta["err"].json({
                        status: 400,
                        err: respuesta["err"],
                        mensaje: "Error al editar el módulo"
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
/*=============================================
PETICION POST
=============================================*/

let createData = (req, res) => {

    // SE OBTIENE CUERPO DEL FORMULARIO 
    let body = req.body;
    // SE DECLARAN LAS VARIABLES
    let title = body.titulo;
    let desc = body.descripcion;

    if(title == undefined){
        return res.json({
            status: 400,
            mensaje: "El título no puede ir vacío."
        })
    }else if(desc == undefined){
         return res.json({
            status: 400,
            mensaje: "La descripción no puede ir vacía."
        })
    }

    let Footer = new footer({
        titulo: title,
        descripcion: desc 
    })

    Footer.save((err, data) => {
        if(err){

            return res.json({
                status:400,
                mensaje: "Error al almacenar el título y la descripción del módulo.",
                err
            })

        }

        res.json({

            status:200,
            data,
            mensaje:"El módulo ha sido creado con éxito."

        })

    })

}
/*=============================================
PETICION DELETE
=============================================*/
let borrarData = (req, res) =>
{
    //Borramos registro en mongoDB
    //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
    footer.findByIdAndRemove(id, (err, data) =>
    {
        if (err)
        {
            return res.json({
                status: 500,
                mensaje: "Error al borrar el footer",
                err
            })
        }
        res.json({
            status: 200,
            mensaje: "El footer fue eliminado correctamente"
        })
        
    })
    
}


/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    showData,
    updateData,
    createData
}