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

	imagen.mv(`./archivos/planes/img-plan/${nombre}.${extension}`, err => {

		if(err){
			return res.json({
				status: 500,
				mensaje: "Error al guardar la imagen",
				err
			})
		}


		//Obtenemos los datos del formulario para pasarlos al modelo

		let plan = new planes({
		
			imagen:`${nombre}.${extension}`,
            type: body.type,
			nombre:body.nombre,
			descripcion :body.descripcion,
			precio:body.precio,
			nivel:body.nivel,
			pros:body.pros

		})

		//Guardamos en MongoDB

		plan.save((err, data)=>{

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
				mensaje:"El plan ha sido creado con éxito"

			})

		})

	})
}


/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    showPlanes,
    newPlan
}