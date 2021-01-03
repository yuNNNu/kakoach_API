const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const SocialMedia = require('../../controlador/socialmedia/socialmedia.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/get-socialmedia', SocialMedia.mostrarData);
app.put('/update-socialmedia/:id',verificarToken, SocialMedia.editarData);
app.post('/crear-socialmedia',verificarToken, SocialMedia.crearData);
app.get('/mostrar-socialmedia-logo/:imagen', SocialMedia.mostrarLogo);

app.get('/get-socialmedia-route/:nombre', SocialMedia.getSocialMediaUrl);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;