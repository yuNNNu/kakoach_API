// IMPORTAMOS EL MODELO
const SocialMedia = require('../../modelo/socialmedia/socialmedia.modelo');

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

	//Obtenemos los datos del formulario para pasarlos al modelo
	let urlRuta = body.url;
	let socialmedia = new SocialMedia({
	
		url: urlRuta

	})

	//Guardamos en MongoDB

	socialmedia.save((err, data)=>{

		if(err){

			return res.json({
				status:400,
				mensaje: "Error al almacenar la url",
				err
			})

		}

		res.json({

			status:200,
			data,
			mensaje:"La url ha sido creada con éxito"

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

	
module.exports = {
    mostrarData,
    editarData,
    crearData
}