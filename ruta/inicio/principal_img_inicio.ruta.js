const express = require('express');
const app = express();
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const PrincipalImgInicio = require('../../controlador/inicio/principal_img_inicio.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/mostrar-principal-img-inicio-data', PrincipalImgInicio.mostrarData);
app.get('/mostrar-principal-img-inicio/:imagen', PrincipalImgInicio.mostrarImg);
app.put('/editar-principal-img-inicio-data/:id', PrincipalImgInicio.editarData);
app.post('/crear-principal-img-inicio-data', PrincipalImgInicio.crearData);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;