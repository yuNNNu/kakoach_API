const express = require('express');
const app = express();
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const mail = require('../../controlador/mailing/mail')
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/

app.post('/send-mail', mail.sendEmail);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;