const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Planes = require('../../controlador/planes/planes.controlador');
// funciones
app.get('/show-planes', Planes.showPlanes)
app.get('/show-plan/:imagen', Planes.mostrarImg);
app.get('/show-pdf-plan/:pdf', Planes.mostrarPdf);
app.delete('/delete-plan/:id',verificarToken, Planes.deletePlan);
app.put('/update-plan/:id',verificarToken, Planes.updateData);
app.post('/new-plan',verificarToken, Planes.newPlan )
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;