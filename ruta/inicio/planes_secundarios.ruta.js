const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Plan = require('../../controlador/inicio/planes_secundarios.controlador')
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-secondaries-plan', Plan.showPlan);
app.put('/edit-secondary-plan/:id',verificarToken, Plan.updateSecondaryPlan)
app.post('/create-secondary-plan',verificarToken, Plan.createData);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;