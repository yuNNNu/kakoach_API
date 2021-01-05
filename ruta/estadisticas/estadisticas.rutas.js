const express = require('express');
const app = express();
const Estadistica = require('../../controlador/estadisticas/estadisticas.controlador');
app.get('/monto-total', Estadistica.All);

module.exports = app;