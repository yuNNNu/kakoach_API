const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const PrincipalImgSobremi = require('../../controlador/sobremi/principal_img_sobremi.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/mostrar-principal-img-sobremi-data', PrincipalImgSobremi.mostrarData);
app.get('/mostrar-principal-img-sobremi/:imagen', PrincipalImgSobremi.mostrarImg);
app.put('/editar-principal-img-sobremi-data/:id',verificarToken, PrincipalImgSobremi.editarData);
app.post('/crear-principal-img-sobremi-data',verificarToken, PrincipalImgSobremi.crearData);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;