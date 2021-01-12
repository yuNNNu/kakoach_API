const express = require('express');
const app = express();
// importamos midellware
const {verificarToken} = require('../../middlewares/autenticacion')
/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/
const Info = require('../../controlador/inicio/info_planes.controlador')
/*=============================================
CREAMOS LAS RUTAS HTTP
=============================================*/
app.get('/show-info-planes-inicio', Info.showinfo_planes);
app.put('/edit-info-planes-incio/:id', Info.updateInfoPlanes);
/*========================
EXPORTAMOS RUTA
========================== */
module.exports = app;