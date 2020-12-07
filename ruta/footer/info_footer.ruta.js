const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Footer = require('../../controlador/footer/info_footer.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-footer', Footer.showData);
app.put('/edit-footer/:id', Footer.updateData);
app.post('/create-footer', Footer.createData);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;