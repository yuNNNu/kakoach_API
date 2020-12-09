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

// evitar devolver password
adminSchema.methods.toJSON = function() 
{
	let admin = this;
	let adminObject = admin.toObject();
	delete adminObject.password;
	return adminObject;
} 

module.exports = mongoose.model("admins", adminSchema);