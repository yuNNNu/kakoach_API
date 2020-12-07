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


/*=============================================
=               RUTAS GENERALES               =
=============================================*/

app.use(require('./ruta/navbar/logo.ruta'));
app.use(require('./ruta/socialmedia/socialmedia.ruta'));
app.use(require('./ruta/footer/info_footer.ruta'));

/*=============================================
=               RUTAS DE INICIO               =
=============================================*/
app.use(require('./ruta/inicio/benefits_inicio.ruta'));
app.use(require('./ruta/inicio/plan_personal.ruta'));
app.use(require('./ruta/inicio/principal_img_inicio.ruta'));

/*=============================================
=               RUTAS DE PLANES               =
=============================================*/
app.use(require('./ruta/planes/benefits_planes.ruta'));
app.use(require('./ruta/planes/principal_img_planes.ruta'));
app.use(require('./ruta/planes/planes.ruta'));

/*=============================================
=               RUTAS DE SOBREMI              =
=============================================*/
app.use(require('./ruta/sobremi/principal_img_sobremi.ruta'));
app.use(require('./ruta/sobremi/tarjetas.ruta'));

/*=============================================
=               RUTAS DE USUARIOS             =
=============================================*/

app.use(require('./ruta/usuarios/clientes.ruta'));
app.use(require('./ruta/usuarios/administradores.ruta'));



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