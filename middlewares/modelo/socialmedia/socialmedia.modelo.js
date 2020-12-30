const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let socialMediaSchema = new Schema({

	url: {
		type: String, 
		required: [true, "La url es obligatoria"]
	}

})

module.exports = mongoose.model("socialmedias", socialMediaSchema);