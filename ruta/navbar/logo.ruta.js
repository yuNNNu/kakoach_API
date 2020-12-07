const express = require('express');
const app = express();
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const logo = require('../../controlador/navbar/logo.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-data-logo', logo.showDataLogo);
app.put('/edit-logo/:id', logo.updateLogo);
app.get('/mostrar-logo/:imagen', logo.mostrarImg);

/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;