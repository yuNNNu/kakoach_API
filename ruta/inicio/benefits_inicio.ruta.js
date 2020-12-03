const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Benefits = require('../../controlador/inicio/benefits_inicio.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-benefit', Benefits.showBenefits);
app.put('/edit-benefit/:id', Benefits.updateBenefits);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;