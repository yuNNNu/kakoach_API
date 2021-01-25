/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Logo = require('../../modelo/navbar/logo.modelo')
// LIBRARIES
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

/*=============================================
FUNCIÓN GET
=============================================*/
let showDataLogo = (req, res) =>
{
    //https://mongoosejs.com/docs/api.html#model_Model.find
    Logo.find({})
        .exec((err, data) =>
        {
            
            if(err){

                return res.json({

                status:500,
                mensaje: "Error en la petición"

                })
            }

            //Contar la cantidad de registros
            Logo.countDocuments({}, (err, total)=>{

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
=                   GET IMG                   =
=============================================*/
let mostrarImg = (req, res) =>
{
    let imagen = req.params.imagen;
    let rutaImg = `./archivos/navbar/logo/${ imagen }`;

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





/*=============================================
FUNCIÓN PUT
=============================================*/
let editarData = (req, res) => {

    //Capturamos el id del slide a actualizar

    let id = req.params.id;

    //Obtenemos el cuerpo del formulario

    let body = req.body;

    Logo.findById(id, (err, data) => {
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
                mensaje: "El logo no existe en la Base de Datos"
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

                    if( imagen.mimetype != 'image/png' 
                         && imagen.mimetype != 'image/PNG'){

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

                    let nombre = "logo";

                    //Capturar la extensión del archivo

                    let extension = imagen.name.split('.').pop();

                    imagen.mv(`./archivos/navbar/logo/${nombre}.${extension}`, err =>{

                        if(err){

                            let respuesta = {

                                res: res,
                                mensaje: "Error al guardar la imagen"
                            }

                            reject(respuesta);

                        }

                        //Borramos la antigua imagen

                        if(fs.existsSync(`./archivos/navbar/logo/${rutaImagen}`)){

                            fs.unlinkSync(`./archivos/navbar/logo/${rutaImagen}`);

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
                }

                //Actualizamos en MongoDB
                //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
                Logo.findByIdAndUpdate(id, datos, {new:true, runValidators:true}, ( err, data) =>{

                    if(err){

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


let createData = (req, res) => {
    

    if(!req.files){
        return res.json({
            status: 500,
            mensaje: "La imagen no puede ir vacía"
        })
    }

    let imagen = req.files.imagen;

    // SE VALIDAN LAS EXTENSIONES DE LA IMAGEN

    if(imagen.mimetype != 'image/png' 
        &&  imagen.mimetype != 'image/PNG'){

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

    let nombre = "logo";

    //Capturar la extensión del archivo

    let extension = imagen.name.split('.').pop();

    // Movemos la imagen a la carpeta

    imagen.mv(`./archivos/navbar/logo/${nombre}.${extension}`, err => {

        if(err){
            return res.json({
                status: 500,
                mensaje: "Error al guardar la imagen",
                err
            })
        }


        //Obtenemos los datos del formulario para pasarlos al modelo

        let datosLogo = new Logo({
        
            imagen:`${nombre}.${extension}`,

        })

        //Guardamos en MongoDB

        datosLogo.save((err, data)=>{

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


/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    showDataLogo,
    editarData,
    mostrarImg,
    createData
}

