const express = require('express');
const app = express();
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const imgPrincipal = require('../../controlador/inicio/principal_img_inicio.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-slide-index', imgPrincipal.showFirstImage);
app.put('/edit-slide-index/:id', imgPrincipal.updateFirstImage);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;