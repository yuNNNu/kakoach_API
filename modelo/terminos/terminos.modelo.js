const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let terminos = new Schema({


	
	contenido:{
		type: String,
		required: [true, "El contenido es obligatoria"]
	}

})

module.exports = mongoose.model("terminos", terminos);