/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let persosnalPlanSchema = new Schema({
    imagen: {
        type: String,
        required: [true, "La imagen es obligatoria"]
    },
    titulo: {
        type: String,
        required: [true, "El titulo es obligatorio"]
    },
    descripcion: {
		type: String,
		required:[true, "La descripción es obligatoria"]
    },
    valor: {
        type: Number,
        required: [true, "El valor es obligatorio"]
    },
    pros: {
        type: Array,
        required: [true, "Los pros son obligatorios"]
    }
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("personal_plans", persosnalPlanSchema);