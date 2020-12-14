/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let planesSchema = new Schema({
 
    type: {
		type: String,
		required:[true, "El tipo es obligatorio"]
    },
     imagen: {
        type: String,
        required: [true, "La imagen es obligatoria"]
    },
    nombre: {
		type: String,
		required:[true, "El nombre es obligatoria"]
    },
     descripcion: {
        type: String,
        required: [true, "La descripcion es obligatoria"]
    },
    precio: {
		type: String,
		required:[true, "El precio es obligatorio"]
    },
     pros: {
        type: Array,
        required: [true, "Se requiere como minimo un pro del plan"]
    },
    nivel: {
		type: String,
		required:[true, "El nivel es obligatorio"]
	},
    archivo: {
		type: String,
		required:[true, "El archivo es obligatorio"]
	},
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("planes", planesSchema);