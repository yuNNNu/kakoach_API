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
app.put('/edit-categorie/:id', Categories.updateData);
app.post('/create-categorie', Categories.createData);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;