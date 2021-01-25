/*=============================================
=            SE IMPORTA EL MODELO             =
=============================================*/

const Slide = require('../modelo/slide.modelo');

/*=============================================
=                PETICION GET                 =
=============================================*/

let mostrarSlide = (req, res) =>{

		Slide.find({}).exec((err, data) => {
			if(err){
				return res.json({
					status: 500,
					mensaje: "Error en la petición"
				})		
			}

			// Mostrar conteo de indices que existen en mongoose 
			Slide.countDocuments({}, (err, total) => {

				res.json({
				status: 200,
				total,
				data
				})

			});
		}

	)

}

/*=============================================
=                PETICION POST                =
=============================================*/

let crearSlide = (req, res) => {

}

/*=============================================
=                PETICION PUT                 =
=============================================*/

let editarSlide = (req, res) => {

}

/*=============================================
=              PETICION DELETE                =
=============================================*/

let eliminarSlide = (req, res) => {

}

module.exports = {
	mostrarSlide,
	crearSlide
}