const express = require('express');
const app = express();
const Captcha = require('../../controlador/captcha/captcha.controlador');
app.post('/validate-captcha', Captcha.validateCaptcha);

module.exports = app;