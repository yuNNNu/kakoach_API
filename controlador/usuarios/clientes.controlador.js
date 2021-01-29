// IMPORTAMOS EL MODELO
const Clientes = require('../../modelo/usuarios/clientess.modelo');
 require('../../config')
//  Requerimos el móduo para encriptar contraseñas
const bcrypt = require('bcrypt');
const crypto = require ('crypto'); 
const axios = require('axios');
var nodemailer = require("nodemailer")


mailNodeMailer = process.env.MAIL;
passMail = process.env.PASS;
// base mail
var transporter = nodemailer.createTransport({
host: 'smtp.gmail.com',
port: 465,
secure: true,
auth: {
	user: mailNodeMailer,
	pass: passMail
}
})


				


/*=============================================
=                     GET                     =
=============================================*/
let mostrarData = (req, res) => {

	Clientes.find({}).exec((err, data) => {
		if(err){
			return res.json({
				status: 500,
				mensaje: "Error en la petición"
			})		
		}

		// Mostrar conteo de indices que existen en mongoose y retorno de los datos
		Clientes.countDocuments({}, (err, total) => {
			if(err){
				return res.json({
					status: 500,
					mensaje: "Error en la petición"
				})
			}

			res.json({
			status: 200,
			total,
			data
			})

		});
	})
}
/*=============================================
=                    POST                     =
=============================================*/

let crearData = (req, res) => {

	// SE OBTIENE CUERPO DEL FORMULARIO
	let body = req.body;


	// BASE DE MAIL
	
	let mail = req.body.mail;
	let expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
	let esValido = expReg.test(mail);
	let date = Date.parse("") || 0;
	let nombre = body.nombre;
	let apellido = body.apellido;
	//Obtenemos los datos del formulario para pasarlos al modelo


	let clientes = new Clientes({
	
		nombre: nombre.toLowerCase(),
		apellido: apellido.toLowerCase(),
		mail: body.mail,
		verified: false,
		token: "",
		tokenExpires: date,
		password: bcrypt.hashSync(body.password,10)
	})

	
	
	
	
	Clientes.find({"mail":body.mail})
		.then(result =>
		{
			
		
			if (result.length  !== 0)
			{
				return res.json({
				status:400,
				mensaje: "Error el mail ya se encuentra registrado",
				err
				})
				
			} 

			//Guardamos en MongoDB
			clientes.save((err, data)=>{
				

				if(err){

					return res.json({
						status:400,
						mensaje: "Error al almacenar al usuario",
						err
					})

				}

				res.json({

					status:200,
					data,
					mensaje:"El usuario ha sido creado con éxito, verifique y confirme su cuenta en el correo"

				})




				let id = data._id.toString();
				let token = bcrypt.hashSync(id, 10);
				
				let obj = token.split("/")
			
				let text="";
				let t= obj.forEach((x) =>
				{
					text = text + x;
					
				})
				token = text;
				
				
				let expiresIn = Date.now () + 5 * 3600 * 1000; 

				let registrarToken = (id, token, expiresIn, data) => {
					return new Promise((resolve, reject) => {
						let datos = {
							nombre: data.nombre,
							apellido: data.apellido,
							mail: data.mail,
							password: data.password,
							verified: data.verified,
							token: token,
							tokenExpires: expiresIn
						}

						Clientes.findByIdAndUpdate(id, datos, {new: true, runValidators: true}, (err, data) => {
						
							if(err){
								let respuesta = {
									res: res,
									err: err
								}

								reject(respuesta);
							}

							let respuesta = {
								res: res,
								data: data
							}

							resolve(respuesta)
						})
					})

				}

				/*=============================================
				=                   PROMESA            =
				=============================================*/
				
				registrarToken(id, token, expiresIn, data).then(respuesta =>
				{
					// RUTA DEL METODO activateAccount()
					let link = process.env.RUTAAPI + 'account/active/' + token;
					let linklogo = process.env.RUTAAPI + 'mostrar-logo/logo.png';
					let linklogoinstagram = process.env.RUTAAPI + 'mostrar-socialmedia-logo/instagram.png';
					let linklogofacebook = process.env.RUTAAPI + 'mostrar-socialmedia-logo/facebook.png';
					let linklogoyoutube = process.env.RUTAAPI + 'mostrar-socialmedia-logo/youtube.png';
					let linklogotwitter = process.env.RUTAAPI + 'mostrar-socialmedia-logo/twitter.png';
					// GET LINK SOCIALMEDIA
						axios.get(process.env.RUTAAPI + "get-socialmedia",
						{
							headers: {
								"Content-type": "application/json; charset=UTF-8"
							}
						}
						).then((x) =>
						{
							
							let socialMedia = x.data.data;
							instagram = socialMedia[0]["url"];
							facebook = socialMedia[1]["url"];
							youtube = socialMedia[2]["url"];
							twitter = socialMedia[3]["url"];
                        


							

var mailOptions = {
  from: "Ka Koach",
  to: data.mail,
  subject: "Bienvenid@ a Ka Koach 💪 | 🇨🇱",
  text: body.password,
  html: `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
	<title>
	</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style type="text/css">
		#outlook a{padding: 0;}
				.ReadMsgBody{width: 100%;}
				.ExternalClass{width: 100%;}
				.ExternalClass *{line-height: 100%;}
				body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
				table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
				img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
				p{display: block; margin: 13px 0;}
	</style>

	<style type="text/css">
		@media only screen and (max-width:480px) {
						@-ms-viewport {width: 320px;}
						@viewport {	width: 320px; }
					}
	</style>

	<style type="text/css">
		@media only screen and (max-width:480px) {
		
					table.full-width-mobile { width: 100% !important; }
					td.full-width-mobile { width: auto !important; }
		
		}
		@media only screen and (min-width:480px) {
		.dys-column-per-100 {
		width: 100.000000% !important;
		max-width: 100.000000%;
		}
		}
		@media only screen and (min-width:480px) {
		.dys-column-per-100 {
		width: 100.000000% !important;
		max-width: 100.000000%;
		}
		}
    </style>
    
	</head>
	<body>
	<div>

		<div style='background:#EFF3F9;background-color:#EFF3F9;margin:0px auto;max-width:600px;'>
		<table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#EFF3F9;background-color:#EFF3F9;width:100%;'>
			<tbody>
			<tr>
				<td style='direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;'>

				<div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
					<table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
					<tr>
						<td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						<table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:collapse;border-spacing:0px;'>
							<tbody>
							<tr>
								<td style='width:216px;'>
                                <!-- <img alt='Logo' height='189' src='${linklogo}' style='border:none;display:block;font-size:13px;height:189px;outline:none;text-decoration:none;width:100%;' width='216' /> -->
                                <!-- LOGO EN SVG -->
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="200" height="200" viewBox="0 0 2000.000000 2000.000000"
                                    preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,2000.000000) scale(0.100000,-0.100000)"
                                    fill="#000000" stroke="none">
                                    <path d="M9815 18919 c-864 -41 -1781 -219 -2548 -495 -538 -194 -933 -373
                                    -1396 -631 -520 -291 -1076 -687 -1533 -1090 -183 -161 -597 -575 -763 -763
                                    -654 -739 -1205 -1631 -1562 -2530 -67 -168 -140 -359 -163 -425 -100 -290
                                    -267 -928 -320 -1220 -111 -618 -165 -1333 -141 -1880 38 -834 133 -1412 366
                                    -2219 133 -462 319 -927 568 -1420 556 -1102 1361 -2093 2339 -2877 484 -388
                                    912 -668 1463 -956 344 -179 605 -295 975 -433 379 -142 622 -217 984 -305
                                    1189 -289 2392 -338 3581 -145 534 86 1061 220 1520 385 427 154 769 299 1065
                                    452 402 209 588 318 928 546 525 351 960 711 1402 1163 660 674 1166 1385
                                    1589 2231 487 975 782 2028 875 3123 51 598 44 1123 -25 1735 -43 384 -93 667
                                    -179 1015 -131 526 -205 760 -377 1195 -252 637 -555 1201 -941 1755 -500 717
                                    -1061 1316 -1740 1858 -250 200 -371 288 -657 477 -655 433 -1279 737 -2074
                                    1009 -969 332 -2157 496 -3236 445z m851 -129 c701 -39 1264 -129 1889 -301
                                    1731 -476 3250 -1453 4404 -2833 937 -1120 1586 -2500 1844 -3921 207 -1135
                                    194 -2189 -39 -3328 -272 -1330 -908 -2644 -1798 -3712 -196 -236 -319 -369
                                    -560 -611 -942 -940 -2104 -1660 -3361 -2082 -970 -325 -1981 -481 -2980 -458
                                    -165 4 -318 9 -340 11 -22 2 -107 9 -190 15 -1315 97 -2648 519 -3785 1200
                                    -885 530 -1627 1165 -2271 1945 -965 1169 -1603 2567 -1848 4050 -74 443 -121
                                    992 -121 1402 0 734 120 1603 321 2315 239 848 608 1656 1095 2396 467 710
                                    1043 1352 1714 1913 478 400 1086 797 1647 1078 1096 547 2247 851 3483 920
                                    215 12 691 12 896 1z"/>
                                    <path d="M9695 18580 c-535 -36 -1051 -116 -1582 -246 l-73 -18 0 -4759 c0
                                    -3261 3 -4756 10 -4752 6 4 46 79 89 168 43 89 143 293 221 452 78 160 195
                                    398 260 530 65 132 177 362 250 510 73 149 190 387 260 530 147 300 574 1170
                                    793 1615 82 168 198 404 257 525 59 121 166 339 238 485 71 146 188 384 259
                                    530 72 146 368 749 658 1340 290 591 595 1212 677 1380 240 491 466 950 569
                                    1160 l97 195 -72 23 c-130 42 -528 140 -731 181 -328 65 -639 108 -1020 142
                                    -163 14 -985 20 -1160 9z m1200 -144 c372 -34 750 -90 1076 -160 343 -74 414
                                    -121 414 -271 0 -65 -5 -80 -61 -200 -34 -71 -916 -1872 -1962 -4002 -1207
                                    -2460 -1917 -3896 -1946 -3937 -81 -113 -162 -141 -200 -69 -41 80 -40 -36
                                    -43 4133 -3 2797 0 4016 7 4064 20 132 67 197 177 249 136 63 782 166 1233
                                    196 91 7 183 13 205 15 114 11 933 -3 1100 -18z"/>
                                    <path d="M5150 16913 c-541 -406 -1049 -892 -1476 -1413 -684 -835 -1215
                                    -1821 -1527 -2835 -187 -606 -292 -1150 -354 -1830 -25 -276 -25 -1078 0
                                    -1360 86 -961 291 -1788 649 -2630 534 -1252 1370 -2363 2435 -3233 125 -102
                                    428 -332 437 -332 3 0 5 402 4 892 l-3 893 -85 44 c-342 175 -654 404 -946
                                    696 -317 316 -541 629 -756 1058 -147 295 -241 547 -269 722 -10 66 -21 133
                                    -24 150 -3 16 34 -46 83 -140 240 -460 483 -796 793 -1101 270 -264 525 -443
                                    853 -599 114 -54 334 -145 350 -145 3 0 6 2538 6 5640 0 3102 -3 5640 -7 5640
                                    -5 0 -78 -53 -163 -117z m-37 -337 c32 -19 57 -83 68 -169 6 -53 9 -1862 7
                                    -5137 -3 -4835 -4 -5057 -21 -5101 -34 -88 -105 -126 -204 -108 -123 23 -450
                                    240 -679 451 -299 275 -528 573 -780 1012 -115 202 -169 256 -251 256 -151 -1
                                    -150 -236 3 -623 207 -525 511 -1003 880 -1386 221 -230 424 -397 708 -586
                                    214 -142 257 -179 296 -258 47 -96 52 -171 47 -644 -4 -457 -6 -474 -62 -530
                                    -28 -28 -40 -33 -81 -33 -76 0 -135 35 -299 176 -193 165 -624 595 -795 794
                                    -582 675 -1023 1371 -1363 2150 -374 860 -583 1701 -667 2695 -18 210 -24 824
                                    -11 1055 67 1154 336 2195 829 3210 488 1004 1263 2001 2085 2683 131 109 218
                                    137 290 93z"/>
                                    <path d="M15101 16999 c-5 -13 -100 -208 -211 -434 -284 -575 -1079 -2193
                                    -1510 -3070 -76 -154 -269 -548 -430 -875 -502 -1021 -593 -1205 -763 -1553
                                    l-166 -338 111 -222 c61 -122 287 -582 503 -1022 216 -440 479 -975 585 -1190
                                    106 -214 239 -484 295 -600 56 -115 197 -401 312 -635 115 -234 269 -548 343
                                    -697 l134 -273 465 0 c562 0 1228 -13 2125 -41 l670 -20 18 23 c32 40 314 617
                                    388 791 356 840 558 1654 647 2607 14 147 17 291 18 700 0 540 -7 675 -56
                                    1060 -184 1461 -730 2812 -1611 3996 -390 523 -861 1018 -1371 1443 -148 122
                                    -392 311 -459 355 -27 18 -28 18 -37 -5z m239 -327 c97 -46 457 -360 740 -642
                                    1066 -1068 1823 -2401 2185 -3850 112 -450 181 -868 227 -1390 18 -199 18
                                    -1051 0 -1265 -79 -952 -292 -1817 -653 -2650 -248 -575 -321 -671 -524 -699
                                    -28 -4 -278 0 -555 8 -677 21 -1416 36 -1798 36 -178 0 -344 5 -385 11 -158
                                    24 -234 91 -340 298 -108 209 -1906 3868 -1952 3971 -72 161 -81 260 -34 386
                                    35 95 2766 5644 2807 5703 20 30 57 68 82 84 39 24 53 28 100 25 30 -2 75 -14
                                    100 -26z"/>
                                    <path d="M10320 7253 c-101 -208 -300 -616 -442 -907 -142 -291 -257 -531
                                    -255 -533 2 -1 84 9 182 22 303 43 833 93 1416 133 l106 7 -76 155 c-43 85
                                    -224 454 -405 820 -180 366 -331 668 -335 673 -4 4 -90 -163 -191 -370z m266
                                    -153 c50 -32 94 -107 256 -437 148 -303 174 -371 161 -436 -14 -77 -52 -115
                                    -143 -141 -62 -18 -560 -66 -683 -66 -150 0 -204 49 -195 178 5 68 14 90 174
                                    419 193 398 229 458 294 491 51 26 83 24 136 -8z"/>
                                    <path d="M11325 5204 c-577 -34 -1103 -94 -1664 -189 -232 -40 -467 -87 -476
                                    -97 -2 -2 -37 -73 -78 -158 -279 -579 -909 -1875 -917 -1885 -11 -14 -390
                                    -798 -390 -806 0 -4 10 -9 23 -12 12 -3 108 -28 212 -56 738 -199 1513 -292
                                    2315 -278 741 14 1369 101 2060 286 229 62 719 218 738 236 6 6 -309 665 -573
                                    1200 -142 286 -322 651 -400 810 -78 160 -217 442 -309 628 l-166 337 -77 -1
                                    c-43 -1 -177 -7 -298 -15z m220 -162 c61 -28 125 -89 170 -162 18 -30 228
                                    -449 465 -930 731 -1480 714 -1443 691 -1544 -30 -130 -130 -179 -626 -304
                                    -901 -229 -1876 -304 -2815 -216 -494 46 -1074 150 -1217 220 -78 38 -105 66
                                    -122 132 -22 81 -5 129 208 562 109 223 346 708 525 1078 180 370 343 701 363
                                    735 72 122 155 191 274 228 169 53 965 162 1474 204 105 8 208 17 230 19 22 2
                                    105 3 185 2 128 -1 151 -4 195 -24z"/>
                                    <path d="M14820 5047 c0 -4 563 -1153 670 -1369 19 -38 36 -68 39 -68 10 0
                                    250 207 403 347 168 153 422 412 581 591 l108 121 -38 10 c-368 99 -1054 243
                                    -1566 330 -98 17 -182 33 -188 36 -5 4 -9 4 -9 2z m835 -288 c388 -78 475
                                    -106 529 -169 20 -25 26 -42 26 -81 0 -94 -39 -146 -273 -367 -167 -158 -225
                                    -194 -305 -194 -106 0 -149 48 -294 336 -125 249 -148 308 -148 380 0 104 69
                                    151 205 140 33 -3 150 -23 260 -45z"/>
                                    </g>
                                    </svg>
								</td>
							</tr>
							</tbody>
						</table>
						</td>
					</tr>
					<tr>
						<td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						<div style="color:#000000;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:36px;line-height:1;text-align:center;">
							Bienvenid@!
						</div>
						</td>
					</tr>
					<tr>
						<td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						<div style="color:#000000;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;line-height:20px;text-align:center;">
							Confirma tu dirección de correo electrónico para completar la validación de tu cuenta KaKoach. Es simple, sólo haz click en el botón de abajo.
						</div>
						</td>
					</tr>
					<tr>
						<td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;' vertical-align='middle'>
						<table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:separate;line-height:100%;width:200px;'>
							<tr>
							<td align='center' bgcolor='#0061F2' role='presentation' style='background-color:#0061F2;border:none;border-radius:4px;cursor:auto;padding:10px 25px;' valign='middle'>
								<a href='${link}' style="background:#0061F2;color:#ffffff;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;font-weight:bold;line-height:30px;margin:0;text-decoration:none;text-transform:none;" target='_blank'>
								Activate!
								</a>
							</td>
							</tr>
						</table>
						</td>
					</tr>
					</table>
				</div>
			
				</td>
			</tr>
			</tbody>
		</table>
		</div>
		
		<div style='background:#000000;background-color:#000000;margin:0px auto;max-width:600px;'>
		<table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#000000;background-color:#000000;width:100%;'>
			<tbody>
			<tr>
				<td style='direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;text-align:center;vertical-align:top;'>

				<div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
					<table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
					<tr>
						<td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						<table border='0' cellpadding='0' cellspacing='0' style='cellpadding:0;cellspacing:0;color:#000000;font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:40%;' width='40%'>
							<tbody>
							<!-- LOGOS SOCIALMEDIA DEL MENSAJE DE VERIFICACION -->
							<tr align='center'>
							
								<td align='center'>
                                <!-- INSTAGRAM -->
								<a href='${instagram}'>
                                   
									<!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style="color: #ffffff;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> -->
                                    <img src='${linklogoinstagram}' class="img-fluid" alt="">
                                    INSTAGRAM
								</a>
                                </td>
                                <!-- FACEBOOK -->
								<td align='center'>
								<a href='${facebook}'>
									<!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style="color: #ffffff;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>								 -->
                                    <img src='${linklogofacebook}' class="img-fluid" alt="">
                                    FACEBOOK
								</a>
                                </td>
                                <!-- YOUTUBE -->
								<td align='center'>
								<a href='${youtube}'>
								 	<!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="color: #ffffff;"  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-youtube"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> -->
                                    <img src='${linklogoyoutube}' class="img-fluid" alt="">
                                    youtube
								</a>
                                </td>
                                <!-- TWITTER -->
								<td align='center'>
								<a href='${twitter}'>
									<!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"  style="color: #ffffff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> -->
                                    <img src='${linklogotwitter}' class="img-fluid" alt="">
                                    twitter
								</a>
								</td>
								
							</tr>
							</tbody>
						</table>
						</td>
					</tr>
					</table>
				</div>

				</td>
			</tr>
			</tbody>
		</table>
		</div>

		<div style='background:#000000;background-color:#000000;margin:0px auto;max-width:600px;'>
		<table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#000000;background-color:#000000;width:100%;'>
			<tbody>
			<tr>
				<td style='direction:ltr;font-size:0px;padding:20px 0;padding-top:0px;text-align:center;vertical-align:top;'>

				<div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
					<table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
					<tr>
						<td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						<div style="color:#BBBBBB;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:12px;line-height:1;text-align:center;">
							KaKoach © Derechos Reservados
						</div>
						</td>
					</tr>
					</table>
				</div>
	
				</td>
			</tr>
			</tbody>
		</table>
		</div>
		
	</div>
	</body>
</html>`,
};
							transporter.verify().then(() =>
							{
								console.log('Listo para enviar  el correo')
							})
							transporter.sendMail(mailOptions, (err, info) =>
							{
								if (err)
								{
									res.status(500).send(err.message);
								} else
								{
									return res.json({
										status:200,
										mensaje: "Correo enviado correctamente"
									})
								
								}

							})

							
						})
					
				
				
			
				



				}).catch(errr => {
					
					console.log(errr)
				})

			})


		}).catch(err =>
		{
				return res.json({
				status:400,
				mensaje: "Email ya registrado!",
				err
				})
		})
}
/*=============================================
=               Activar cuenta          =
=============================================*/
let activateAccount = (req, res) => {

	// activeToken == _id encriptado

	let activeToken = req.params.activetoken;


	Clientes.findOne({
		token: activeToken
	}, (err, data) => {
		if(err){
			return res.json({
				status: 500,
				mensaje: "Error en la petición",
				err
			})
		}

		if(!data){
			return res.json({
				status: 400,
				mensaje: "El usuario no existe en la base de datos",
				err
			})
		}


		let id = data._id
		/////////////
		const seconds = 60;
		let now = new Date((Date.now() + seconds) / 1000);
		let expires = data.tokenExpires/1000;
			
		
		if (now.getTime() < expires)
		{
			
			// TOKEN NO HA EXPIRADO
			let datos = {
			nombre: data.nombre,
			apellido: data.apellido,
			mail: data.mail,
			password: data.password,
			verified: true,
			token: data.token,
			tokenExpires: data.tokenExpires
			}

			Clientes.findByIdAndUpdate(id, datos, {new:true, runValidators:true},
			(err, datas) => {
				if(err){

					return res.json({
						status: 500,
						mensaje: "Error en la petición"
					})
				}

				let url = process.env.RUTAHOST + "login/" + data.token;
				
				res.redirect(url)

					
			})
		}else{
			// TOKEN EXPIRÓ

			axios.delete(process.env.RUTAAPI + "eliminar-usuario/" + id);
			let url = process.env.RUTAHOST + "login/" + data.token;
			res.redirect(url);
		}
    })

}
/*=======================================
=       FUNCION LOGIN CON MAIL Y PASS     =
========================================= */
let loginCliente = (req, res) => {
    //Obtenemos el cuerpo del formulario
    let body = req.body;
    //Recorremos la base de datos en busqueda de coincidencia con el usuario
    Clientes.findOne({
        mail: body.mail
    }, (err, data) => {
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en la petición",
                err
            })
        }
        //Validamos que el Usuario exista
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El usuario no existe en la base de datos",
                err
            })
        }
        //Validamos que la contraseña sea correcta
        if (!bcrypt.compareSync(body.password, data.password)) {
            return res.json({
                status: 400,
                mensaje: "La contraseña es incorrecta",
                err
            })
		}
       
        res.json({
			status: 200,
			verified: data.verified,
			nombre: data.nombre,
            mensaje: "ok"
        })
    })
}
/*=============================================
PETICION  DELETE PLANS
=============================================*/
let deleteCliente = (req, res) => {

	// Se captura id de la tarjeta a eliminar

	let id = req.params.id;

	Clientes.findById(id, (err, data) => {

		if(err){

			return res.json({

				status: 500,
				mensaje: "Error en la petición",
				err
			})
		}

		if(!data){

			return res.json({
				status: 400,
				mensaje: "No existe el usuario en la BD",
				err

			})
		}


		// borrar dato en mongo db

		Clientes.findByIdAndRemove(id, (err, data) => {

			if(err){

				return res.json({

					status: 500,
					mensaje: "Error en la petición",
					err

				})
			}

			res.json({

				status: 200,
				mensaje: "El usuario fue eliminado correctamente"
			})

		})


	})
}
/*=============================================
=                    UPDATE USER             =
=============================================*/
let updateCliente = (req, res) => {

	let token = req.params.token;
	let body = req.body;

	Clientes.findOne({
		token: token	
	}, (err, data) =>
	{
		let tk = parseInt(data.tokenExpires)	
		
		if(err){
			return res.json({
				status: 500,
				mensaje: "Error en la petición",
				err
			})
		}
		
		if(!data){
			return res.json({
				status: 400,
				mensaje: "No existe usuario en la BD",
				err
			})
		}
		if (tk < Date.now())
		{
			return res.json({
				status: 400,
				mensaje: "No ha sido posible cambiar la contraseña, el link ha caducado.",
				err
			})
		}	
		
		

		let id = data._id;
		let password = data.password;

		let validaPassword = (body, password) => {
			return new Promise((resolve, reject) => {
				if(body.password == undefined){
					resolve(password)
				}else{
					password = bcrypt.hashSync(body.password,10)
					resolve(password)
				}
			})
		}

		let cambiarRegistrosBd = (id, password, data) => {
			return new Promise((resolve, reject) => {

				let datos = {
					nombre: data.nombre,
					apellido: data.apellido,
					mail: data.mail,
					password: password,
					token: data.token,
					tokenExpires: data.tokenExpires,
					verified: data.verified

				}	

				Clientes.findByIdAndUpdate(
				id,
				datos,
				{ new:true, runValidators: true},
				(err, data) => {

					if(err){
						let respuesta = {
							res: res,
							err: err
						}

						reject(respuesta);
					}

					let respuesta = {
						res: res,
						data: data
					}

					resolve(respuesta)
				});


			})

		}

		/*=============================================
                SINCRONIZAMOS LA PROMESAS
        =============================================*/

        validaPassword(body, password).then((password) => {
        	cambiarRegistrosBd(id, password, data).then((respuesta) => {
		    	respuesta["res"].json({
		    		status: 200,
		            mensaje: "El usuario fue editado con éxito"
		    	})
	        }).catch(respuesta => {
	        	respuesta["res"].json({

	                status: 400,
	                err: respuesta["err"],
	                mensaje: "Error al editar el usuario"

	              })
	        })
        }).catch((respuesta) => {
        	respuesta["res"].json({
        		status: 400,
        		mensaje: respuesta["mensaje"]
        	})
        })

	})	
}
/*=============================================
=    FUNCION LOGIN CON TOKEN        =
=============================================*/
let loginToken = (req, res) =>
{
	let token = req.params.token;
	

	Clientes.findOne({ token: token }, (err, data) =>
	{
		if (err) {
		return res.json({
			status: 500,
			mensaje: "Error en el servidor",
			err
		})
        }
        //Validamos que el Usuario exista
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "No existe usuario asociado al token",
                err
            })
		}
	
		let cliente = ({
			nombre: data["nombre"],
			apellido: data["apellido"],
			mail: data["mail"],
			verified: data["verified"]
		})

		let id = data._id
		/////////////
		const seconds = 60;
		let now = (Date.now()+seconds)/1000;
		let expires = data.tokenExpires/1000;

		

		if(expires > now){
			// TOKEN NO HA EXPIRADO
			res.json({
				status: 200,
				cliente
			})
		} else
		{
			Clientes.findByIdAndRemove(id, (err, res) =>
			{
				if (err)
				{
					res.json({
					status: 400,
					mensaje: "Error al eliminar usuario"
					})
				}
			})
		
			// TOKEN EXPIRÓ
			res.json({
				status: 400,
				err: err,
				mensaje: "El link ha caducado"
			})
		}
	})
}

/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    mostrarData,
	crearData,
	loginCliente,
	deleteCliente,
	updateCliente,
	activateAccount,
	loginToken
}