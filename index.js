/*=============================================
=         INSTANCIAS DE REQUERIMIENTOS        =
=============================================*/
require('./config');
const axios = require('axios');
const endpoint= 'https://webpay3gint.transbank.cl/'
const path = "rswebpaytransaction/api/webpay/v1.0/transactions";
let url = endpoint + path;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
/*=============================================
=VARIABLE PARA LAS FUNCIONALIDADES DE EXPRESS =
=============================================*/

//SOCKET
var SocketSingleton = require('./controlador/webpay/singleton/socket-singletion');
var http = require('http');
var server = http.createServer(app);
SocketSingleton.configure(server); // <--here
server.listen('3000');

/////////
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

/*=============================================
=        MIDDLEWARES PARA BODY-PARSER         =
=============================================*/

app.use(bodyParser.urlencoded({ limit:'10mb', extend:true}));
app.use(bodyParser.json({limit:'10mb', extend:true}));

/*=============================================
=        MIDDLEWARES PARA FILEUPLOAD          =
=============================================*/

app.use(fileUpload());
app.use(cors());

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
app.use(require('./ruta/inicio/planes_secundarios.ruta'));

/*=============================================
=               RUTAS DE PLANES               =
=============================================*/
app.use(require('./ruta/planes/benefits_planes.ruta'));
app.use(require('./ruta/planes/principal_img_planes.ruta'));
app.use(require('./ruta/planes/categoria.ruta'));
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

=               RUTAS DE WEBPAY              =
=============================================*/

app.use(require('./ruta/webpay/webpay.ruta'));
/*=============================================

=               RUTAS DE MAIL              =
=============================================*/
app.use(require('./ruta/mailing/mailing.ruta'));
/*=============================================

=               RUTAS DE ESTADISTICAS         =
=============================================*/
app.use(require('./ruta/estadisticas/estadisticas.rutas'));
/*=============================================

=               RUTAS DE CAPTCHA              =
=============================================*/
app.use(require('./ruta/captcha/captcha.ruta'));

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


