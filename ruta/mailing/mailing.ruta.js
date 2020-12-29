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
app.post('/contactme-mail', mail.ContactMeMail);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;