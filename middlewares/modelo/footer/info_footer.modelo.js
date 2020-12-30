/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let footerSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "El titulo es obligatorio"]
    },
    descripcion: {
    	type: Array,
    	required: [true, "La descripcion es obligatoria"]
	}
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("footers", footerSchema);