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
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    descripcion: {
		type: String,
		required:[true, "La descripción es obligatoria"]
    },
    precio: {
        type: Number,
        required: [true, "El precio es obligatorio"]
    },
    pros: {
        type: Array,
        required: [true, "Los pros son obligatorios"]
    },
    pdf: {
        type: String,
        required: [true, "El pdf no puede ir vacio"]
    }
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("personal_plans", persosnalPlanSchema);