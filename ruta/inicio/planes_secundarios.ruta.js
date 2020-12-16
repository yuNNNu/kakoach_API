const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Plan = require('../../controlador/inicio/planes_secundarios.controlador')
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-secondaries-plan', Plan.showPlan);
app.put('/edit-secondary-plan/:id', Plan.updateSecondaryPlan)
app.post('/create-secondary-plan', Plan.createData);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;