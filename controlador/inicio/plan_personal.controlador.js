/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const plan = require('../../modelo/inicio/plan_personal.modelo')
const fs = require('fs');
const path = require('path');
const {
    Promise
} = require('mongoose');
/*=============================================
FUNCIÓN GET
=============================================*/
let showPlan = (req, res) =>
{
    //https://mongoosejs.com/docs/api.html#model_Model.find
    plan.find({})
        .exec((err, data) =>
        {
            
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
let updatePersonalPlan = (req, res) => {
  // caputaramos id de beneficio
  let id = req.params.id;
  // obtenemos el cuerpo del formulario
  let body = req.body;
  //01  VALIDAMOS EXISTENCIA DE BENEFICIO
  plan.findById(id, (err, data) => {
    //Validammos que no haya error
    if (err) {
      return res.json({
        status: 500,
        mensaje: "Error en el servidor",
        err,
      });
    }
    //Validamos que el plan  exista
    if (!data) {
      return res.json({
        status: 404,
        mensaje: "No existe el plan en la base de datos",
        err,
      });
    }
    // recepcion de datos a editar AQUI DEBE SER LA RUTA DE LA IMG
    let rutaImg = data.imagen;
    let rutaPdf = data.pdf;

   

    // 02 VALIDAMOS QUE EXISTAN CAMBIOS
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
              `./archivos/inicio/imgplanprincipal/${nombreImg}.${extensionImg}`,
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
                  fs.existsSync(`./archivos/inicio/imgplanprincipal/${rutaImg}`)
                ) {
                  fs.unlinkSync(
                    `./archivos/inicio/imgplanprincipal/${rutaImg}`
                  ); //Que borre
                }
                //Damos precio a nueva imagen
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
               
                archivoPdf.mv(`./archivos/inicio/pdfs/${ nombrePdf }.${ extensionPdf }`, (errP) =>
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
                    if (fs.existsSync(`./archivos/inicio/pdfs/${ rutaPdf }`))
                    {
                        fs.unlinkSync(`./archivos/inicio/pdfs/${ rutaPdf }`); //Que borre
                    }
                    rutaPdf = `${ nombrePdf }.${ extensionPdf }`;
                    resolve(rutaPdf);
                })


                //   rutaPdf = req.files.pdf.name;
            
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
    // 03 ACTUALIZAR REGISTROS
      let cambiarRegistroBD = (id, rutaImg, rutaPdf, body) =>
      {
          
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
         
        let datosplan = {
          imagen: rutaImg,
          nombre: body.nombre,
          descripcion: body.descripcion,
          precio: body.precio,
          pros: body.pros,
          pdf: rutaPdf,
        };
        //Actualizamos en MongoDB
        //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
        plan.findByIdAndUpdate(
          id,
          datosplan,
          {
            new: true, // Con esto me muestra lo que se guardo y no el antiguo
            runValidators: true, // Con esto me muestra lo que se guardo y no el antiguo
          },
          (err, data) => {
            if (err) {
              let respuesta = {
                res: res,
                error: err,
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
      });
    };
    // 04 SINCRONIZANDO PROMESAS
    validarCambioImg(req, rutaImg)
      .then((rutaImg) => {
        validarCambioPdf(req, rutaPdf)
          .then((rutaPdf) => {
            cambiarRegistroBD(id, rutaImg, rutaPdf, body)
              .then((respuesta) => {
                respuesta["res"].json({
                  status: 200,
                  data: respuesta["data"],
                  mensaje: "El plan personal ha sido actualizado con exito",
                });
              })
                .catch((respuesta) =>
                {
                  
                    respuesta["res"].json({
                    status: 400,
                    err: respuesta["err"],
                    mensaje: "Error al editar el plan personal",
                    });
                });
          })
          .catch((respuesta) => {
            respuesta["res"].json({
              status: 400,
              mensaje: respuesta["mensaje"],
            });
          });
      })
      .catch((respuesta) => {
        respuesta["res"].json({
          status: 400,
          mensaje: respuesta["mensaje"],
        });
      });
  });
};

/*=============================================
FUNCIÓN POST
=============================================*/
let createData = (req, res) => {
    
    let body = req.body;

    if(!req.files){
        return res.json({
            status: 500,
            mensaje: "La imagen no puede ir vacía"
        })
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

    if(imagen.mimetype != 'image/jpeg' && imagen.mimetype != 'image/png' 
        && imagen.mimetype != 'image/JPEG' && imagen.mimetype != 'image/PNG'){

        return res.json({

            status:400,
            mensaje: "la imagen debe ser formato JPG o PNG"
            
        })
    }
    // SE VALIDAN LAS EXTENSIONES DEL PDF
    if (pdf.mimetype != "application/pdf") {
        return res.json({
        status: 400,
        mensaje: "El archivo debe ser formato pdf",
        });
    }

    //Validamos el tamaño del imagen

    if(imagen.size > 2000000){

        return res.json({

            status:400,
            mensaje: "la imagen debe tener un peso inferior a 2MB" 
            
        })
    }
      //Validamos el tamaño del pdf
    if (pdf.size >= 3000000) {
        return res.json({
        status: 400,
        mensaje: "El pdf debe tener un peso inferior o igual a 3MB",
        });
    }

    //Cambiar nombre al archivo

    let nombre = Math.floor(Math.random()*10000);
    let nombrePdf = Math.floor(Math.random() * 97000);
    //Capturar la extensión del archivo

    let extension = imagen.name.split('.').pop();
      //Capturar la extensión del archivo pdf
    let extensionPdf = pdf.name.split(".").pop();
    // Movemos la imagen a la carpeta

    imagen.mv(`./archivos/inicio/imgplanprincipal/${nombre}.${extension}`, err => {

        if(err){
            return res.json({
                status: 500,
                mensaje: "Error al guardar la imagen",
                err
            })
        }

        pdf.mv(`./archivos/inicio/pdfs/${ nombrePdf }.${ extensionPdf }`, (errP) =>
        { 
        if (errP) {
          return res.json({
            status: 500,
            mensaje: "Error al guardar el archivo pdf",
            err,
          });
        }

        //Obtenemos los datos del formulario para pasarlos al modelo

        let datosPlan = new plan({
        
            imagen:`${nombre}.${extension}`,
            nombre:body.nombre,
            descripcion:body.descripcion,
            precio: body.precio,
            pros: body.pros,
            pdf: `${nombrePdf}.${extensionPdf}`

        })
      
        //Guardamos en MongoDB

        datosPlan.save((err, data)=>{

            if(err){

                return res.json({
                    status:400,
                    mensaje: "Error al almacenar el plan",
                    err
                })

            }

            res.json({

                status:200,
                data,
                mensaje:"El plan ha sido creado conexitos"

            })

        })
        });


    })
}
/*=============================================
FUNCIÓN GET MOSTRAR IMG
=============================================*/
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

