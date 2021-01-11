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
app.put('/editar-cliente/:token', Clientes.updateCliente);
app.delete('/eliminar-usuario/:token',verificarToken, Clientes.deleteCliente);
app.get('/account/active/:activetoken', Clientes.activateAccount);
app.post('/login-usuario', Clientes.loginCliente);
app.post('/login-usuario-token/:token', Clientes.loginToken);


/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;