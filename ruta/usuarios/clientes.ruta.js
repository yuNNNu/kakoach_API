const express = require('express');
const app = express();
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const Clientes = require('../../controlador/usuarios/clientes.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/mostrar-clientes', Clientes.mostrarData);
app.post('/crear-cliente', Clientes.crearData);
app.post('/login-usuario', Clientes.loginCliente);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;