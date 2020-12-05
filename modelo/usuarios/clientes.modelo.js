const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({

	nombre: {
		type: String,
		required: [true, "El nombre es obligatorio"]
	},
	apellido: {
		type: String, 
		required: [true, "El apellido es obligatorio"]
	},
	mail:{
		type: String,
		required: [true, "El mail es obligatorio"]
	},
	password:{
		type: String,
		required: [true, "La password es obligatoria"]
	}

})

module.exports = mongoose.model("clientes", userSchema);