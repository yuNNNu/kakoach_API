const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let plansImgSchema = new Schema({

	imagen: {
		type: String,
		required: [true, "La imagen es obligatoria"]
	},
	titulo: {
		type: String, 
		required: [true, "El título es obligatorio"]
	},
	descripcion:{
		type: String,
		required: [true, "La descripción es obligatoria"]
	}

})

module.exports = mongoose.model("principalimageplans", plansImgSchema);