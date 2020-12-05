const express = require('express');
const app = express();
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const SocialMedia = require('../../controlador/socialmedia/socialmedia.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/get-socialmedia', SocialMedia.mostrarData);
app.put('/update-socialmedia/:id', SocialMedia.editarData);
app.post('/crear-socialmedia', SocialMedia.crearData);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;