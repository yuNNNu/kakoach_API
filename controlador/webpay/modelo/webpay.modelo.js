

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let webpay = new Schema({
    key: {
        type: String,
        required: [true, "Key es obligatorio"]
    }
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = mongoose.model("webpays", webpay);