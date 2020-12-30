const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let slideSchema = new Schema({

	rutaImagen: {
		type: String,
		required: [true, "La imagen es obligatoria"]
	},
	titulo: {
		type: String, 
		required: [false]
	},
	descripcion:{
		type: String,
		required: [false]
	}

})

module.exports = mongoose.model("slides", slideSchema);