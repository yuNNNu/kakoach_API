const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const Clientes = require('../../controlador/usuarios/clientes.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/mostrar-clientes',verificarToken, Clientes.mostrarData);
app.post('/crear-cliente', Clientes.crearData);
app.post('/login-usuario', Clientes.loginCliente);
app.delete('/eliminar-usuario/:id',verificarToken, Clientes.deleteCliente);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;