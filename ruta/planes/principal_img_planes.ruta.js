const express = require('express');
const app = express();
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const PrincipalImgPlanes = require('../../controlador/planes/principal_img_planes.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/mostrar-principal-img-planes-data', PrincipalImgPlanes.mostrarData);
app.get('/mostrar-principal-img-planes/:imagen', PrincipalImgPlanes.mostrarImg);
app.put('/editar-principal-img-planes-data/:id', PrincipalImgPlanes.editarData);
app.post('/crear-principal-img-planes-data', PrincipalImgPlanes.crearData);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;