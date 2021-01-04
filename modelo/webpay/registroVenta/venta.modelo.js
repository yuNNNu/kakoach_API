const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ventasSchema = new Schema({

	email: {
		type: String,
		required: [true, "El email es obligatorio"]
	},
	id_plan: {
		type: String, 
		required: [true, "El id del plan es obligatorio"]
    },
	nombre_plan: {
		type: String, 
		required: [true, "El nombre del plan es obligatorio"]
    },
    nro_venta: {
		type: String,
		required: [true, "El nro de venta es obligatorio"]
	},
	fecha_venta: {
		type: Date, 
		required: [true, "La fecha de venta es obligatoria"]
    },
    session_id:{
		type: String, 
		required: [true, "session_id es obligatorio"]
    },
    token:{
		type: String, 
		required: [true, "El token de la venta es obligatorio"]
	},
	precio: {
		type: Number, 
		required: [true, "El precio es obligatorio"]
    }

})
// evitar devolver el token
// ventasSchema.methods.toJSON = function() 
// {
// 	let venta = this;
// 	let ventaObject = venta.toObject();
// 	delete ventaObject.token;
// 	return ventaObject;
// } 



module.exports = mongoose.model("ventas", ventasSchema);