const express = require('express');
const app = express();
const axios = require('axios');

const Webpay = require('../../controlador/webpay/webpay.controlador');

app.post('/pagar', Webpay.pagar);
app.post('/commit', Webpay.commit);
app.post('/registro-venta', Webpay.RegistrarCompras)
app.get('/showVentas',Webpay.showVentas)

module.exports = app;