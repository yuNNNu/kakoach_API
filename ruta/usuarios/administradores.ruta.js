const express = require('express');
const app = express();
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const Admins = require('../../controlador/usuarios/administradores.controlador');
/*========================
IMPORTAMOS EL MIDDLEWARE
========================== */
const {
    verificarToken
} = require('../../middlewares/autenticacion');
/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/mostrar-administradores', verificarToken,  Admins.mostrarData);
app.post('/crear-administrador', Admins.crearData);
app.post('/login-admin', Admins.login);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;