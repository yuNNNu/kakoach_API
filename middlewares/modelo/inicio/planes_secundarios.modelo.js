/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let secondaryPlanSchema = new Schema({
    id: {
        type: String,
        required: [true, "El id es obligatorio"]
    }
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("secondary_plans", secondaryPlanSchema);