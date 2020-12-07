const express = require('express');
const app = express();
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Planes = require('../../controlador/planes/planes.controlador');
// funciones
app.get('/show-planes', Planes.showPlanes)
app.post('/new-plan', Planes.newPlan )
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;