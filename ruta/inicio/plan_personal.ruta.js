const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Plan = require('../../controlador/inicio/plan_personal.controlador')
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-personal-plan', Plan.showPlan);
app.get('/show-personal-plan-img/:imagen', Plan.mostrarImg);
app.put('/edit-personal-plan/:id',verificarToken, Plan.updatePersonalPlan)
app.post('/create-personal-plan', verificarToken, Plan.createData);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;