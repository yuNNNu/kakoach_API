
let webpay = new Schema({
    buy_order: {
        type: String,
        required: [true, "El titulo es obligatorio"]
    },
    session_id: {
		type: String,
		required:[true, "La descripción es obligatoria"]
    },
    amount: {
        type: Number,
        required: [true, "El titulo es obligatorio"]
    },
    return_url: {
		type: String,
		required:[true, "La descripción es obligatoria"]
	}
})
/*=============================================
EXPORTAMOS EL MODELO
=============================================*/
module.exports = webpay;