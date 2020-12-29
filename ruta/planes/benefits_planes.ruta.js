const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Benefits = require('../../controlador/planes/benefits_planes.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-planbenefits', Benefits.showBenefits);
app.put('/edit-planbenefit/:id',verificarToken, Benefits.updateBenefits);
app.post('/create-planbenefit',verificarToken, Benefits.createBenefit);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;