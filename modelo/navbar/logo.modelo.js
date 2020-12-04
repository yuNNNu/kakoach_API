/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let logoSchema = new Schema({
    logo: {
        type: String,
        required: [true, "El logo es obligatorio"]
    }
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("navbars", logoSchema);