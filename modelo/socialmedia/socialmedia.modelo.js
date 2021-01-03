const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let socialMediaSchema = new Schema({

	nombre:{
		type: String,
		required: [true, "el nombre es obligatorio"]
	},
	imagen:{
		type: String,
		required: [true, "la imagen es obligatoria"]
	},
	url: {
		type: String, 
		required: [true, "La url es obligatoria"]
	}

})

module.exports = mongoose.model("socialmedias", socialMediaSchema);