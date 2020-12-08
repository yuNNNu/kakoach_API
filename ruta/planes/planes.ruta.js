const express = require('express');
const app = express();
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Planes = require('../../controlador/planes/planes.controlador');
// funciones
app.get('/show-planes', Planes.showPlanes)
app.post('/new-plan', Planes.newPlan )
app.delete('/delete-plan/:id', Planes.deletePlan);
app.put('/update-plan/:id', Planes.updatePlan);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;