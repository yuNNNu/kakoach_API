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
app.put('/editar-cliente/:id', Clientes.updateCliente);
app.delete('/eliminar-usuario/:id',verificarToken, Clientes.deleteCliente);
app.get('/account/active/:activetoken', Clientes.activateAccount);


/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;