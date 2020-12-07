/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "El titulo es obligatorio"]
    },
    descripcion: {
		type: String,
		required:[true, "La descripción es obligatoria"]
	},
    type: {
		type: String,
		required:[true, "El tipo es obligatorio"]
	},
    click: {
		type: String,
		required:[true, "La función del click es obligatoria"]
	}
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("categories", categoriaSchema);