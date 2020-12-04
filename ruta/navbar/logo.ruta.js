const express = require('express');
const app = express();
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const logo = require('../../controlador/navbar/logo.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-logo', logo.showLogo);
app.put('/edit-logo/:id', logo.updateLogo);

/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;