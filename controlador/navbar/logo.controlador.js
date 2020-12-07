/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Logo = require('../../modelo//navbar/logo.modelo')
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
    let rutaImg = `./archivos/img/logo/${ imagen }`;

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
let updateLogo = (req, res) =>
{
    // caputaramos id de beneficio
    let id = req.params.id;
    // obtenemos el cuerpo del formulario
    let body = req.body;
        //01  VALIDAMOS EXISTENCIA DE BENEFICIO
        Logo.findById(id, (err, data) =>
        {
         console.log(data)
        
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
                    mensaje: "No existe el Logo en la base de datos",
                    err
                })
            }
            // recepcion de datos a editar AQUI DEBE SER LA RUTA DE LA IMG
            let rutaImg = data.logo;
       
                // 02 VALIDAMOS QUE EXISTAN CAMBIOS
                let validarCambio = (req, rutaImg) =>
                {  
                //   solo valide que si es que no viene una foto
                    return new Promise((resolve, reject) =>
                    {
                        if (req.files)
                        {
                           	//Se captura la imagen

                            let imagen = req.files.imagen;
                            // validamos formato
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

                        imagen.mv(`./archivos/img/logo/${nombre}.${extension}`, err =>{

                            if(err){

                                let respuesta = {

                                    res: res,
                                    mensaje: "Error al guardar la imagen"
                                }

                                reject(respuesta);

                            }

                            //Borramos la antigua imagen

                            if(fs.existsSync(`./archivos/img/logo/${rutaImg}`)){

                                fs.unlinkSync(`./archivos/img/logo/${rutaImg}`);

                            }

                            //Damos valor a la nueva imagen

                            rutaImg = `${nombre}.${extension}`;

                            resolve(rutaImg);

                        })

                        } else
                        {
                            rutaImg = body.imagen
                            resolve(rutaImg)
                       }
                  
                    })
                  
                }
                
                // 03 ACTUALIZAR REGISTROS
                let cambiarRegistroBD = (id, rutaImg) =>
                {
                    return new Promise((resolve, reject) =>
                    {
                        let datosLogo = {
                            logo: rutaImg
                        }
                        //Actualizamos en MongoDB
                        //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
                        Logo.findByIdAndUpdate(id, datosLogo, {
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
                validarCambio(req, rutaImg).then((rutaImg) =>
                {
                    cambiarRegistroBD(id, rutaImg).then(respuesta =>
                    {
                        console.log("res",respuesta)
                        respuesta["res"].json({
                        status: 200,
                        data: respuesta["data"],
                        mensaje: "El Logo ha sido actualizado con exito"
                        })
                    }).catch((respuesta =>
                    {
                        respuesta["err"].json({
                        status: 400,
                        err: respuesta["err"],
                        mensaje: "Error al editar el Logo "
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
    showDataLogo,
    updateLogo,
    mostrarImg
}

