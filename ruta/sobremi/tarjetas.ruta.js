const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const Tarjetas = require('../../controlador/sobremi/tarjetas.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/mostrar-tarjetas-data', Tarjetas.mostrarData);
app.get('/mostrar-tarjeta-img/:imagen', Tarjetas.mostrarImg);
app.delete('/eliminar-tarjeta/:id',verificarToken, Tarjetas.eliminarTarjeta);
app.put('/editar-tarjeta-data/:id',verificarToken, Tarjetas.editarData);
app.post('/crear-tarjeta-data', verificarToken,Tarjetas.crearData);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;