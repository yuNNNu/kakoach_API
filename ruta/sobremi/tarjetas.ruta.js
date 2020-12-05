const express = require('express');
const app = express();
/*=============================================
=          SE IMPORTA EL CONTROLADOR          =
=============================================*/

const Tarjetas = require('../../controlador/sobremi/tarjetas.controlador');

/*=============================================
=          SE CREAN LAS RUTAS HTTP            =
=============================================*/

app.get('/mostrar-tarjetas-data', Tarjetas.mostrarData);
app.get('/mostrar-tarjeta-img/:imagen', Tarjetas.mostrarImg);
app.put('/editar-tarjeta-data/:id', Tarjetas.editarData);
app.delete('/eliminar-tarjeta/:id', Tarjetas.eliminarTarjeta);
app.post('/crear-tarjeta-data', Tarjetas.crearData);

/*=============================================
=          SE EXPORTA LA RUTA                 =
=============================================*/

module.exports = app;