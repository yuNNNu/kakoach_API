// IMPORTAMOS EL MODELO
const Administradores = require('../../modelo/usuarios/administradores.modelo');

/*=============================================
=                     GET                     =
=============================================*/


let mostrarData = (req, res) => {

	Administradores.find({}).exec((err, data) => {
		if(err){
			return res.json({
				status: 500,
				mensaje: "Error en la peticion"
			})		
		}

		// Mostrar conteo de indices que existen en mongoose y retorno de los datos
		Administradores.countDocuments({}, (err, total) => {
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

	let administradores = new Administradores({
	
		user: body.user,
		password: body.password
	})

	//Guardamos en MongoDB

	administradores.save((err, data)=>{

		if(err){

			return res.json({
				status:400,
				mensaje: "Error al almacenar al usuario",
				err
			})

		}

		res.json({

			status:200,
			data,
			mensaje:"El módulo ha sido creado con éxito"

		})

	})

}

/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    mostrarData,
    crearData
}