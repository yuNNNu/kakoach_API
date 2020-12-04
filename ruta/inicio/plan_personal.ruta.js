const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Plan = require('../../controlador/inicio/plan_personal.controlador')
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-personal-plan', Plan.showPlan);
app.put('/edit-personal-plan/:id', Plan.updatePersonalPlan)
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;