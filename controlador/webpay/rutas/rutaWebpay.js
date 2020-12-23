const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Webpay = require('../webpay.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.post('/pagar', Webpay.pagar);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;