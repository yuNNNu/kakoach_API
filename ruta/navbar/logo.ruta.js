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
app.put('/edit-logo/:id', logo.editarData);
app.get('/mostrar-logo/:imagen', logo.mostrarImg);
app.post('/create-logo', logo.createData);

/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;