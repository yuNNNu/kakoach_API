/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Categoria = require('../../modelo/planes/categoria.modelo')
// LIBRARIES
const fs = require('fs');
const path = require('path');
/*=============================================
ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
=============================================*/
// const fs = require('fs');
// const { resolve } = require('path');
// const { rejects } = require('assert');

/*=============================================
FUNCIÓN GET
=============================================*/

let showData = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	Categoria.find({})
        .exec((err, data) =>
        {
           

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		Categoria.countDocuments({}, (err, total)=>{

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

// update
let updateData = (req, res) =>  {
/*=============================================
FUNCIÓN PUT
=============================================*/
    // caputaramos id de beneficio
    let id = req.params.id;
    // obtenemos el cuerpo del formulario
    let body = req.body;
    //01  VALIDAMOS EXISTENCIA DE BENEFICIO
    Categoria.findById(id, (err, data) =>
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
                mensaje: "No existe el nivel en la base de datos",
                err
            })
        }

    
        let rutaImagen = data.imagen;   
        let desc = data.descripcion;
        let tit = data.titulo;
        // validar img
        let validarCambio = (req, rutaImagen) => {
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

					imagen.mv(`./archivos/planes/category/${nombre}.${extension}`, err =>{

						if(err){

							let respuesta = {

								res: res,
								mensaje: "Error al guardar la imagen"
							}

							reject(respuesta);

						}

						//Borramos la antigua imagen

						if(fs.existsSync(`./archivos/planes/category/imgprincipal/${rutaImagen}`)){

							fs.unlinkSync(`./archivos/planes/category/${rutaImagen}`);

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

        let cambiarRegistroBd = (id, body, rutaImagen,desc,tit, data) => {
            return new Promise((resolve, reject) => {

                if(body.descripcion == undefined || body.descripcion == ""){
                    desc = desc;
                }else{
                    desc = body.descripcion;
                }
                if(body.titulo == undefined || body.titulo == ""){
                    tit = tit;
                }else{
                    tit = body.titulo;
                }

                let datos = {
                    titulo: tit,
                    descripcion: desc,
                    type: data.type,
                    click: data.click,
                    imagen: rutaImagen
                }

                Categoria.findByIdAndUpdate(id, datos, {new:true, runValidators:true}, (err, data) => {
                    if(err){
                        let respuesta = {
                            res: res,
                            err: err
                        }

                        reject(respuesta)
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

        validarCambio(req, rutaImagen).then(rutaImagen => {

            cambiarRegistroBd(id, body, tit, desc,rutaImagen, data).then(respuesta =>{

                respuesta["res"].json({

                    status:200,
                    data: respuesta["data"],
                    mensaje:"La categoria fue editada con éxito"

                })

            }).catch( respuesta => {

                respuesta["res"].json({

                    status:400,
                    err: respuesta["err"],
                    mensaje:"Error al editar la categoria"

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
// create
let createData = (req, res) => {

    // SE OBTIENE CUERPO DEL FORMULARIO 
    let body = req.body;
    // SE DECLARAN LAS VARIABLES
    let title = body.titulo;
    let desc = body.descripcion;
    let type = body.type;
    let click = body.click;
      
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
    }else if(type == undefined){
        return res.json({
            status: 400,
            mensaje: "El tipo no puede ir vacío."
        })
    }else if(click == undefined){
        return res.json({
            status: 400,
            mensaje: "La función del click no puede ir vacía."
        })
    }
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

    imagen.mv(`./archivos/planes/category/${nombre}.${extension}`, err =>
    { 
        if(err){
            return res.json({
                status: 500,
                mensaje: "Error al guardar la imagen",
                err
            })
        }
	    //Obtenemos los datos del formulario para pasarlos al modelo
        let categoria = new Categoria({
        titulo: title,
        descripcion: desc,
        type: type,
        click: click,
        imagen: `${nombre}.${extension}`
        })
        //Guardamos en MongoDB
        categoria.save((err, data) => {
            if(err){

                return res.json({
                    status:400,
                    mensaje: "Error al almacenar la categoria",
                    err
                })

            }

            res.json({

                status:200,
                data,
                mensaje:"La categoria fue creada con exito"

            })

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