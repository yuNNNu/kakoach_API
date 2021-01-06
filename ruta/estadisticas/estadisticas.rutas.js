const express = require('express');
const app = express();
const Estadistica = require('../../controlador/estadisticas/estadisticas.controlador');
app.post('/estadisticas', Estadistica.All);
app.post('/estadisticas-mensual', Estadistica.AllByMonth);

module.exports = app;