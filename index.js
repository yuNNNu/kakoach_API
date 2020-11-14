/*=============================================
=         INSTANCIAS DE REQUERIMIENTOS        =
=============================================*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
/*=============================================
=VARIABLE PARA LAS FUNCIONALIDADES DE EXPRESS =
=============================================*/

const app = express();

/*=============================================
=        MIDDLEWARES PARA BODY-PARSER         =
=============================================*/

app.use(bodyParser.urlencoded({ limit:'10mb', extend:true}));
app.use(bodyParser.json({limit:'10mb', extend:true}));


/*=============================================
=   ESQUEMA PARA MODELO CONECTOR A MONGODB    =
=============================================*/

let Schema = mongoose.Schema;
let slideSchema = new Schema({

})

/*=============================================
=            CONEXIÓN A BASE DE DATOS         =
=============================================*/
mongoose.connect('mongodb://localhost:27017/fit_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res) => {

	if(err) throw err;
	console.log("Conectado a la base de datos");
});

/*=============================================
=           SALIDA AL PUERTO HTTP             =
=============================================*/

app.listen(4000, ()=> {
	console.log('Puerto 4000 habilitado');
})