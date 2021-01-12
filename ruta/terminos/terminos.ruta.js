const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Terminos = require('../../controlador/terminos/terminos.controlador')
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/mostrar-terminos', Terminos.showTerminos);
app.put('/editar-terminos/:id', Terminos.updateTerminos);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;