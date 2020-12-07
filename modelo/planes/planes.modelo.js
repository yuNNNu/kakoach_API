/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let planesSchema = new Schema({
 
    type: {
		type: String,
		required:[true, "La descripción es obligatoria"]
    },
     imagen: {
        type: String,
        required: [true, "El titulo es obligatorio"]
    },
    nombre: {
		type: String,
		required:[true, "La descripción es obligatoria"]
    },
     descripcion: {
        type: String,
        required: [true, "El titulo es obligatorio"]
    },
    precio: {
		type: String,
		required:[true, "La descripción es obligatoria"]
    },
     pros: {
        type: Array,
        required: [true, "El titulo es obligatorio"]
    },
    nivel: {
		type: String,
		required:[true, "La descripción es obligatoria"]
	},
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("planes", planesSchema);