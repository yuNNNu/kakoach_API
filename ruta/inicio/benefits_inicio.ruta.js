const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Benefits = require('../../controlador/inicio/benefits_inicio.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-benefits', Benefits.showBenefits);
app.put('/edit-benefit/:id',verificarToken, Benefits.updateBenefits);
app.post('/create-benefit',verificarToken, Benefits.createBenefit);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;