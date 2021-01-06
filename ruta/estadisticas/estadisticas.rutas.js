const express = require('express');
const app = express();
const Estadistica = require('../../controlador/estadisticas/estadisticas.controlador');
app.post('/estadisticas', Estadistica.All);

module.exports = app;