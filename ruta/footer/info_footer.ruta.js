const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Footer = require('../../controlador/footer/info_footer.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-footer', Footer.showData);
app.get('/show-individual-footer/:id', Footer.showIndividualData);
app.put('/edit-footer/:id',verificarToken, Footer.updateData);
app.post('/create-footer',verificarToken, Footer.createData);
app.delete('/borrar-footer/:id',verificarToken, Footer.borrarData)
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;