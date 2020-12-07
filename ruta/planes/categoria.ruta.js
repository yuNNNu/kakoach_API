const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Categories = require('../../controlador/planes/categoria.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-categories', Categories.showData);
app.put('/edit-category/:id', Categories.updateData);
app.post('/create-category', Categories.createData);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;