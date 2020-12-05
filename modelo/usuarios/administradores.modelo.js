const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let adminSchema = new Schema({

	user: {
		type: String,
		required: [true, "El usuario es obligatorio"]
	},
	password: {
		type: String, 
		required: [true, "La password es obligatoria"]
	}

})

module.exports = mongoose.model("admins", adminSchema);