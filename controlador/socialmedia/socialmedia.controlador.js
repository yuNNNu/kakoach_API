// IMPORTAMOS EL MODELO
const SocialMedia = require('../../modelo/socialmedia/socialmedia.modelo');
// LIBRARIES
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
/*=============================================
=                     GET                     =
=============================================*/


let mostrarData = (req, res) => {

	SocialMedia.find({}).exec((err, data) => {
		if(err){
			return res.json({
				status: 500,
				mensaje: "Error en la peticion"
			})		
		}

		// Mostrar conteo de indices que existen en mongoose y retorno de los datos
		SocialMedia.countDocuments({}, (err, total) => {
			if(err){
				return res.json({
					status: 500,
					mensaje: "Error en la petición"
				})
			}

			res.json({
			status: 200,
			total,
			data
			})

		});
	})

}


/*=============================================
=                    POST                     =
=============================================*/

let crearData = (req, res) => {

	// SE OBTIENE CUERPO DEL FORMULARIO
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


      imagen.mv(`./archivos/socialmedia/${imagen.name}`, err => {

        if(err){
            return res.json({
                status: 500,
                mensaje: "Error al guardar la imagen",
                err
            })
        }


        //Obtenemos los datos del formulario para pasarlos al modelo

       	let socialmedia = new SocialMedia({

			nombre: body.nombre,
			imagen: `${imagen.name}`,
			url: body.url

		})

        //Guardamos en MongoDB

        socialmedia.save((err, data)=>{

            if(err){

                return res.json({
                    status:400,
                    mensaje: "Error al almacenar el logo del módulo",
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

/*=============================================
=                     PUT                     =
=============================================*/

let editarData = (req, res) => {

	//Capturamos el id del slide a actualizar

	let id = req.params.id;

	//Obtenemos el cuerpo del formulario

	let body = req.body;
	SocialMedia.findById(id, (err, data) => {

		if(err){
			return res.json({
				status: 500,
				mensaje: "Error en el servidor",
				err
			})
		}

		if(!data){

			return res.json({
				status: 400,
				mensaje: "La url no existe en la Base de Datos"
			})

		}

		// let datos = {
		// 	url: rutaUrl
		// }

		let rutaUrl = data.url;
        let validarCambio = (body, rutaUrl) => {  
            return new Promise((resolve, reject) =>
            {
                if (body.url == undefined || body.url == "")
                {
                   resolve(rutaUrl)
                } else
                {
                    rutaUrl = body.url
                    resolve(rutaUrl)
               }
            })
        }

        let cambiarRegistroBD = (id, rutaUrl) => {
            return new Promise((resolve, reject) => {

                let datosSocialMedia = {
                    url: rutaUrl
                }
                //Actualizamos en MongoDB
                //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
                SocialMedia.findByIdAndUpdate(id, datosSocialMedia, {
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
        validarCambio(body, rutaUrl).then((rutaUrl) => {
            cambiarRegistroBD(id, rutaUrl).then(respuesta => {
                respuesta["res"].json({
                status: 200,
                data: respuesta["data"],
                mensaje: "La url ha sido actualizada con éxito"
                })
            }).catch((respuesta =>
            {
                respuesta["err"].json({
                status: 400,
                err: respuesta["err"],
                mensaje: "Error al editar la url"
                })
            }))
        }).catch((respuesta => {
            respuesta["res"].json({
            status: 400,
            mensaje: respuesta["mensaje"]
        	})
        }))
		
	})
}

let mostrarLogo = (req, res) => {

    let imagen = req.params.imagen;
    let rutaImg = `./archivos/socialmedia/${imagen}`;

    fs.exists(rutaImg, exists => {
        if(!exists){
            return res.json({
                status: 400,
                mensaje: "La imagen no existe"
            })
        }

        res.sendFile(path.resolve(rutaImg));
    })

}

	
module.exports = {
    mostrarData,
    editarData,
    crearData,
    mostrarLogo
}