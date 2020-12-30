const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Categories = require('../../controlador/planes/categoria.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-categories', Categories.showData);
app.get('/show-img-category/:imagen', Categories.mostrarImg)
app.put('/edit-category/:id',verificarToken, Categories.updateData);
app.post('/create-category',verificarToken, Categories.createData);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;