process.env.PORT = process.env.PORT || 4000;
/*==================================================================
CREO SECRET PARA TOKEN
==================================================================== */
process.env.SECRET = "nopainnogain";
/*==================================================================
Variable caducidad de TOKEN
==================================================================== */
process.env.CADUCIDAD = 60 * 60 * 24 * 30;

process.env.RUTAAPI = 'http://localhost:4000/';
process.env.RUTAHOST = 'http://localhost:4200/';

/*==================================================================
Variable de mailing
==================================================================== */
process.env.MAIL = 'lucianoma63@gmail.com';
process.env.PASS = 'leqkigxahlawknxl'

/*==================================================================
Variable key secret de captcha
==================================================================== */

process.env.SECRETKEYCAPTCHA = '6LdBviQaAAAAAOl1pnFQ1r7sK9oQ8taWSwshBSZy';