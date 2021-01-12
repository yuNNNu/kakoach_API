/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let infoPlanesSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "El titulo es obligatorio"]
    },
    descripcion: {
		type: String,
		required:[true, "La descripción es obligatoria"]
	}
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("infoplanes", infoPlanesSchema);