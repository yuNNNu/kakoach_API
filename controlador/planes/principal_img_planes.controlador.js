// IMPORTAMOS EL MODELO
const PrincipalImgPlanes = require('../../modelo/planes/principal_img_planes.modelo');
// LIBRARIES
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

/*=============================================
=                     GET                     =
=============================================*/


let mostrarData = (req, res) => {

	PrincipalImgPlanes.find({}).exec((err, data) => {
		if(err){
			return res.json({
				status: 500,
				mensaje: "Error en la peticion"
			})		
		}

		// Mostrar conteo de indices que existen en mongoose y retorno de los datos
		PrincipalImgPlanes.countDocuments({}, (err, total) => {
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

	// SE CONSULTA SI VIENE CONSIGO LA IMAGEN PRINCIPAL
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

	imagen.mv(`./archivos/planes/imgprincipal/${nombre}.${extension}`, err => {

		if(err){
			return res.json({
				status: 500,
				mensaje: "Error al guardar la imagen",
				err
			})
		}


		//Obtenemos los datos del formulario para pasarlos al modelo

		let principalimgplanes = new PrincipalImgPlanes({
		
			imagen:`${nombre}.${extension}`,
			titulo:body.titulo,
			descripcion:body.descripcion

		})

		//Guardamos en MongoDB

		principalimgplanes.save((err, data)=>{

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

/*=============================================
=                     PUT                     =
=============================================*/

let editarData = (req, res) => {

	//Capturamos el id del slide a actualizar

	let id = req.params.id;

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	PrincipalImgPlanes.findById(id, (err, data) => {
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
				mensaje: "La imagen, los titulos y los párrafos no existen en la Base de Datos"
			})

		}

		let rutaImagen = data.imagen;

		/*=============================================
		    VALIDAMOS QUE EXISTAN CAMBIO DE IMAGEN
		=============================================*/

		let validarCambioImg = (req, rutaImagen) => {

			return new Promise((resolve, reject) => {

				if(req.files){

					//Se captura la imagen

					let imagen = req.files.imagen;

					if(imagen.mimetype != 'image/jpeg' && imagen.mimetype != 'image/png' 
						&& imagen.mimetype != 'image/JPEG' && imagen.mimetype != 'image/PNG'){

						let respuesta = {
							res: res,
							mensaje: "la imagen debe ser formato JPG o PNG"
				
						}

						reject(respuesta);
					}

					//Validamos el tamaño del archivo

					if(imagen.size > 2000000){

						let respuesta = {

							res: res,
							mensaje: "la imagen debe ser inferior a 2MB"
						}

						reject(respuesta);
					}

					//Cambiar nombre al archivo

					let nombre = Math.floor(Math.random()*10000);

					//Capturar la extensión del archivo

					let extension = imagen.name.split('.').pop();

					imagen.mv(`./archivos/planes/imgprincipal/${nombre}.${extension}`, err =>{

						if(err){

							let respuesta = {

								res: res,
								mensaje: "Error al guardar la imagen"
							}

							reject(respuesta);

						}

						//Borramos la antigua imagen

						if(fs.existsSync(`./archivos/planes/imgprincipal/${rutaImagen}`)){

							fs.unlinkSync(`./archivos/planes/imgprincipal/${rutaImagen}`);

						}

						//Damos valor a la nueva imagen

						rutaImagen = `${nombre}.${extension}`;

						resolve(rutaImagen);

					})	
				}else{
					resolve(rutaImagen);
				}
			})
		}

		let cambiarRegistrosBd = (id, body, rutaImagen) => {
			return new Promise ((resolve, reject) => {
				let datos = {
					imagen: rutaImagen,
					titulo: body.titulo,
					descripcion: body.descripcion
				}

				//Actualizamos en MongoDB
				//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
				PrincipalImgPlanes.findByIdAndUpdate(id, datos, {new:true, runValidators:true}, ( err, data) =>{

					if(err){

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

					resolve(respuesta);
				})
			})
		}

		/*=============================================
		SINCRONIZAMOS LAS PROMESAS
		=============================================*/

		validarCambioImg(req, rutaImagen).then(rutaImagen => {

			cambiarRegistrosBd(id, body, rutaImagen).then(respuesta =>{

				respuesta["res"].json({

					status:200,
					data: respuesta["data"],
					mensaje:"El modulo ha sido actualizado con éxito"

				})

			}).catch( respuesta => {

				respuesta["res"].json({

					status:400,
					err: respuesta["err"],
					mensaje:"Error al editar el modulo"

				})


			})

		}).catch(respuesta => {

			respuesta["res"].json({

				status:400,
				mensaje:respuesta["mensaje"]

			})

		})
	})

}


/*=============================================
=                   GET IMG                   =
=============================================*/
let mostrarImg = (req, res) => {
	let imagen = req.params.imagen;
	let rutaImagen = `./archivos/planes/imgprincipal/${imagen}`;

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
    mostrarData,
    editarData,
    mostrarImg,
    crearData
}