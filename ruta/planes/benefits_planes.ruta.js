const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Benefits = require('../../controlador/planes/benefits_planes.controlador');
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-planbenefits', Benefits.showBenefits);
app.put('/edit-planbenefit/:id', Benefits.updateBenefits);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;