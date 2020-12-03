/*=============================================
=         INSTANCIAS DE REQUERIMIENTOS        =
=============================================*/
require('./config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
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
=        MIDDLEWARES PARA FILEUPLOAD          =
=============================================*/

app.use(fileUpload());

/*=============================================
=        IMPORTACION DE LAS RUTAS             =
=============================================*/

app.use( require('./ruta/inicio/benefits_inicio.ruta'));
app.use( require('./ruta/planes/principal_img_planes.ruta'));

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

/*============================================================
=   SALIDA AL PUERTO HTTP (PUERTO CONFIGURABLE EN CONFIG.js) =
==============================================================*/

app.listen(process.env.PORT, ()=> {
	console.log(`Puerto ${process.env.PORT} habilitado`);
})