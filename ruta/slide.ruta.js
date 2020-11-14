const express = require('express');
const app = express();
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const Slide = require('../controlador/slide.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/mostrar-slide', Slide.mostrarSlide);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;