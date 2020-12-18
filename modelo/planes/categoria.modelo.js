/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [false]
    },
    descripcion: {
		type: String,
		required:[false]
	},
    type: {
		type: String,
		required:[true, "El tipo es obligatorio"]
	},
    click: {
		type: String,
		required:[true, "La función del click es obligatoria"]
	}, imagen: {
		type: String,
		required: [true,"La imagen imagen es obligatoria"]
	}
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("categories", categoriaSchema);