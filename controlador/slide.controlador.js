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
					mensaje: "Error en la peticion"
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

module.exports = {
	mostrarSlide
}