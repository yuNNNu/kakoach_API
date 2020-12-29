const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const logo = require('../../controlador/navbar/logo.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-data-logo', logo.showDataLogo);
app.get('/mostrar-logo/:imagen', logo.mostrarImg);
app.put('/edit-logo/:id',verificarToken, logo.editarData);
app.post('/create-logo',verificarToken, logo.createData);

/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;