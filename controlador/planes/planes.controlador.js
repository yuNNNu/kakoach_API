/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const planes = require('../../modelo/planes/planes.modelo');
// LIBRARIES
const fs = require('fs');
const path = require('path');
/*=============================================
FUNCIÓN GET ALL PLANS
=============================================*/

let showPlanes = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	planes.find({})
        .exec((err, data) =>
        {
           

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		planes.countDocuments({}, (err, total)=>{

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
FUNCIÓN POST PLANS
=============================================*/
let newPlan = (req, res) =>
{
  // SE OBTIENE CUERPO DEL FORMULARIO
  let body = req.body;
  // SE CONSULTA SI VIENE CONSIGO LA IMAGEN PRINCIPAL
  if (!req.files.imagen) {
    return res.json({
      status: 500,
      mensaje: "La imagen no puede ir vacía",
    });
  }
  if (!req.files.pdf) {
    return res.json({
      status: 500,
      mensaje: "El archivo PDF no puede ir vacio",
    });
  }

  let imagen = req.files.imagen;
  let pdf = req.files.pdf;
  // SE VALIDAN LAS EXTENSIONES DE LA IMAGEN

  if (
    imagen.mimetype != "image/jpeg" &&
    imagen.mimetype != "image/png" &&
    imagen.mimetype != "image/JPEG" &&
    imagen.mimetype != "image/PNG"
  ) {
    return res.json({
      status: 400,
      mensaje: "la imagen debe ser formato JPG o PNG",
    });
  }
  // SE VALIDAN LAS EXTENSIONES DEL PDF
  if (pdf.mimetype != "application/pdf") {
    return res.json({
      status: 400,
      mensaje: "El archivo debe ser formato pdf",
    });
  }

  //Validamos el tamaño del imagen

  if (imagen.size > 2000000) {
    return res.json({
      status: 400,
      mensaje: "la imagen debe tener un peso inferior a 2MB",
    });
  }
  //Validamos el tamaño del pdf
  if (pdf.size >= 3000000) {
    return res.json({
      status: 400,
      mensaje: "El pdf debe tener un peso inferior o igual a 3MB",
    });
  }
  //Cambiar nombre a los archivos

  let nombreImg = Math.floor(Math.random() * 10000);
  let nombrePdf = Math.floor(Math.random() * 97000);
  //Capturar la extensión del archivo img
    let extensionImg = imagen.name.split(".").pop();
  //Capturar la extensión del archivo pdf
    let extensionPdf = pdf.name.split(".").pop();
  // Movemos la imagen a la carpeta
  imagen.mv(`./archivos/planes/img-plan/${nombreImg}.${extensionImg}`, (err) => {
    if (err) {
      return res.json({
        status: 500,
        mensaje: "Error al guardar la imagen",
        err,
      });
    }
      pdf.mv(`./archivos/planes/pdfs/${ nombrePdf }.${ extensionPdf }`, (errP) =>
      {
        if (errP) {
          return res.json({
            status: 500,
            mensaje: "Error al guardar el archivo pdf",
            err,
          });
        }

        //Obtenemos los datos del formulario para pasarlos al modelo

        let plan = new planes({
          imagen: `${nombreImg}.${extensionImg}`,
          type: body.type,
          nombre: body.nombre,
          descripcion: body.descripcion,
          precio: body.precio,
          nivel: body.nivel,
          pros: body.pros,
          archivo: `${nombrePdf}.${extensionPdf}`
        });

        //Guardamos en MongoDB

        plan.save((err, data) => {
          if (err) {
            return res.json({
              status: 400,
              mensaje: "Error al almacenar el plan",
              err,
            });
          }

          res.json({
            status: 200,
            data,
            mensaje: "El plan ha sido creado con éxito",
          });
        });
      })


  });
}
// delete
let deletePlan = (req, res) => {

	// Se captura id de la tarjeta a eliminar

	let id = req.params.id;

	planes.findById(id, (err, data) => {

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
				mensaje: "No existe el plan en la BD",
				err

			})
		}

		// borrar antigua imagen

		if(fs.existsSync(`./archivos/planes/img-plan/${data.imagen}`)){

			fs.unlinkSync(`./archivos/planes/img-plan/${data.imagen}`);
		}

		// borrar dato en mongo db

		planes.findByIdAndRemove(id, (err, data) => {

			if(err){

				return res.json({

					status: 500,
					mensaje: "Error al eliminar el plan",
					err

				})
			}

			res.json({

				status: 200,
				mensaje: "El plan fue eliminado correctamente"
			})

		})


	})
}

/*=============================================
=                     PUT                     =
=============================================*/

let updatePlan = (req, res) => {

	//Capturamos el id del slide a actualizar

	let id = req.params.id;

	//Obtenemos el cuerpo del formulario

	let body = req.body;

	planes.findById(id, (err, data) => {
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
				mensaje: "El plan no existe en la Base de Datos"
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

					imagen.mv(`./archivos/planes/img-plan/${nombre}.${extension}`, err =>{

						if(err){

							let respuesta = {

								res: res,
								mensaje: "Error al guardar la imagen"
							}

							reject(respuesta);

						}

						//Borramos la antigua imagen

						if(fs.existsSync(`./archivos/planes/img-plan/${rutaImagen}`)){

							fs.unlinkSync(`./archivos/planes/img-plan/${rutaImagen}`);

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

		let type = data.type;
		let nivel = data.nivel;
		let pros = data.pros;
		let nombre = data.nombre;
		let descripcion = data.descripcion;
		let precio = data.precio;
		let cambiarRegistrosBd = (id, body, rutaImagen, type, nivel, pros, nombre, descripcion, precio) => {
			return new Promise ((resolve, reject) => {

				let temp = body.pros;

				if(body.nombre == undefined){
					nombre = data.nombre
				}else{
					nombre = body.nombre
				}	

				if(body.descripcion == undefined){
					descripcion = data.descripcion
				}else{
					descripcion = body.descripcion
				}

				if(body.precio == undefined){
					precio = data.precio
				}else{
					precio = body.precio
				}


				let datos = {
					type: type,
					nivel: nivel,
					imagen: rutaImagen,
					nombre: nombre,
					descripcion: descripcion,
					precio: precio,
					pros: temp
				}


				//Actualizamos en MongoDB
				//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
				planes.findByIdAndUpdate(id, datos, {new:true, runValidators:true}, ( err, data) =>{

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

		validarCambioImg(req, rutaImagen).then((rutaImagen) => {

			cambiarRegistrosBd(id, body, rutaImagen, type, nivel, pros).then(respuesta =>{

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

/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    showPlanes,
    newPlan,
    deletePlan,
    updatePlan
}