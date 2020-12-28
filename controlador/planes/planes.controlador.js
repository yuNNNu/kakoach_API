/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const planes = require('../../modelo/planes/planes.modelo');
// LIBRARIES
const fs = require('fs');
const path = require('path');
/*=============================================
PETICION  GET ALL PLANS
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
PETICION  POST PLANS
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
        let arrPros = (body.pros).split(',')
        let plan = new planes({
          imagen: `${nombreImg}.${extensionImg}`,
          type: body.type,
          nombre: body.nombre,
          descripcion: body.descripcion,
          precio: body.precio,
          nivel: body.nivel,
          pros: arrPros,
          pdf: `${nombrePdf}.${extensionPdf}`
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
/*=============================================
PETICION  DELETE PLANS
=============================================*/
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
    // borrar antigua imagen

		if(fs.existsSync(`./archivos/planes/pdfs/${data.pdf}`)){

			fs.unlinkSync(`./archivos/planes/pdfs/${data.pdf}`);
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
=      PETICION    PUT                     =
=============================================*/
let updateData = (req, res) =>  {

    // caputaramos id de beneficio
    let id = req.params.id;
    // obtenemos el cuerpo del formulario
    let body = req.body;
    //01  VALIDAMOS EXISTENCIA DE PLAN
    planes.findById(id, (err, data) =>
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
                mensaje: "No existe el plan base de datos",
                err
            })
        }

    
        let rutaImg = data.imagen;
        let rutaPdf = data.pdf;
     
    // 02 VALIDAMOS QUE EXISTAN CAMBIOS IMG
    let validarCambioImg = (req, rutaImg) => {
      return new Promise((resolve, reject) => {
        if (req.files) {
          // VALIDACIONES DE IMAGEN
          if (req.files.imagen) {
            let imagen = req.files.imagen;

            if (
              imagen.mimetype != "image/jpeg" &&
              imagen.mimetype != "image/png" &&
              imagen.mimetype != "image/JPEG" &&
              imagen.mimetype != "image/PNG"
            ) {
              let respuesta = {
                res: res,
                mensaje: "La imagen debe ser formato JPG o PNG",
              };
              return res.json({
                status: 400,
                mensaje: "la imagen debe ser formato JPG o PNG",
              });

              reject(respuesta);
            }
            //Validamos el tamaño del imagen

            if (imagen.size > 2000000) {
              return res.json({
                status: 400,
                mensaje: "la imagen debe tener un peso inferior a 2MB",
              });
              let respuesta = {
                res: res,
                mensaje: "la imagen debe tener un peso inferior a 2MB",
              };
              reject(respuesta);
            }
            //Cambiar nombre al archivo

            let nombreImg = Math.floor(Math.random() * 10000);
            //Capturar la extensión del archivo
            let extensionImg = imagen.name.split(".").pop();
            imagen.mv(
              `./archivos/planes/img-plan/${nombreImg}.${extensionImg}`,
              (err) => {
                if (err) {
                  return res.json({
                    status: 500,
                    mensaje: "Error al guardar la imagen",
                    err,
                  });

                  let respuesta = {
                    res: res,
                    mensaje: "Error al guardar la image",
                  };
                  reject(respuesta);
                }
                //Borramos antiigua imagen
                if (
                  fs.existsSync(`./archivos/planes/img-plan/${rutaImg}`)
                ) {
                  fs.unlinkSync(
                    `./archivos/planes/img-plan/${rutaImg}`
                  ); //Que borre
                }
                //Damos valor a nueva imagen
                rutaImg = `${nombreImg}.${extensionImg}`;
                resolve(rutaImg);
              }
            );
          } else {
            
            resolve(rutaImg);
          }
        } else {
          resolve(rutaImg);
        }
      });
    };
    // VALIDAMOS QUE EXITAN CAMBIOS EN EL PDF
    let validarCambioPdf = (req, rutaPdf) => {
        return new Promise((resolve, reject) =>
        {
        if (req.files) {
            if (req.files.pdf)
            {
                //Capturamos el archivo
                let archivoPdf = req.files.pdf;
                
                if (archivoPdf.mimetype != "application/pdf")
                {
                  return res.json({
                      status: 400,
                      mensaje: "El archivo debe ser formato pdf",
                  });
                  let respuesta = {
                      res: res,
                      mensaje: "El archivo debe ser formato pds"

                  }
                  reject(respuesta);
                }
                //Validamos el tamaño del pdf
                if (archivoPdf.size >= 3000000)
                {
                    return res.json({
                        status: 400,
                        mensaje: "El pdf debe tener un peso inferior o igual a 3MB",
                    });
                    let respuesta = {
                        res: res,
                        mensaje: "El pdf debe tener un peso inferior o igual a 3MB"

                    }
                    reject(respuesta);
                }

                // CREO NOMBRE DEL ARCHIVO
                let nombrePdf = Math.floor(Math.random() * 97000);
                
                //Capturar la extensión del archivo pdf
                let extensionPdf = archivoPdf.name.split(".").pop();
                
                archivoPdf.mv(`./archivos/planes/pdfs/${ nombrePdf }.${ extensionPdf }`, (errP) =>
                {
                    if (errP)
                    {
                        return res.json({
                            status: 500,
                            mensaje: "Error al guardar el archivo pdf",
                            err,
                        });
                        let respuesta = {
                            res: res,
                            mensaje: "Error al guardar el archivo pdf"

                        }
                        reject(respuesta);
                    }
                    //Borramos antiigua imagen
                    if (fs.existsSync(`./archivos/planes/pdfs/${ rutaPdf }`))
                    {
                        fs.unlinkSync(`./archivos/planes/pdfs/${ rutaPdf }`); //Que borre
                    }
                    rutaPdf = `${ nombrePdf }.${ extensionPdf }`;
                    resolve(rutaPdf);
                })
            
            } else
            {
                resolve(rutaPdf);
            }
        } else
        {
             resolve(rutaPdf);
        }
      });
    };

        let cambiarRegistroBd = (id, rutaImg, rutaPdf, body) => {
          return new Promise((resolve, reject) =>
          {
            if (!Number(body.precio))
            {
               return res.json({
                            status: 400,
                            mensaje: "Error, el precio debe ser numerico"
                });
                let respuesta = {
                    res: res,
                    mensaje: "Error, el precio debe ser numerico"

                }
                reject(respuesta);
            }
               let arrPros = (body.pros).split(',')
              let datos = {
                type: body.type,
                nivel: body.nivel,
                nombre: body.nombre,
                descripcion: body.descripcion,
                precio: body.precio,
                pros: arrPros,
                imagen: rutaImg,
                pdf: rutaPdf
              };
              //Actualizamos en MongoDB
              //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
              planes.findByIdAndUpdate(
                id,
                datos,
                { new: true, runValidators: true },
                (err, data) => {
                  if (err) {
                    let respuesta = {
                      res: res,
                      err: err,
                    };

                    reject(respuesta);
                  }

                  let respuesta = {
                    res: res,
                    data: data,
                  };

                  resolve(respuesta);
                }
              );
            })
        }

        /*=============================================
                SINCRONIZAMOS LAS PROMESAS
        =============================================*/

        validarCambioImg(req, rutaImg).then((rutaImg) => {

          validarCambioPdf(req, rutaPdf).then((rutaPdf) =>
          {
            
         
            cambiarRegistroBd(id, rutaImg, rutaPdf, body).then((respuesta) =>
            {

              respuesta["res"].json({

                status: 200,
                data: respuesta["data"],
                mensaje: "El plan fue editado con exito"

              })

            }).catch(respuesta =>
            {

              respuesta["res"].json({

                status: 400,
                err: respuesta["err"],
                mensaje: "Error al editar el plan"

              })


            });
          }).catch((respuesta) =>
          {
            respuesta["res"].json({
              status: 400,
              mensaje: respuesta["mensaje"]
            });
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
=      PETICION  GET (MOSTRAR FOTO)              =
=============================================*/
let mostrarImg = (req, res) => {
	let imagen = req.params.imagen;
	let rutaImagen = `./archivos/planes/img-plan/${imagen}`;

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

/*=============================================
=      PETICION  GET (MOSTRAR PDF)              =
=============================================*/
let mostrarPdf = (req, res) => {
	let pdf = req.params.pdf;
	let rutaImagen = `./archivos/planes/pdfs/${pdf}`;

	fs.exists(rutaImagen, exists => {
		if(!exists){
			return res.json({
				status: 400,
				mensaje: "El pdf no existe"
			})
		}

    res.sendFile(path.resolve(rutaImagen));
    // res.download(path.resolve(rutaImagen));

	})
}
/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
  showPlanes,
  newPlan,
  deletePlan,
	updateData,
  mostrarImg,
  mostrarPdf
}