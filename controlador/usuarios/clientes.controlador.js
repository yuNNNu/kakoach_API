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
				mensaje: "Error en la peticion"
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
	var expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
	var esValido = expReg.test(mail);
	 var date = Date.parse("") || 0;
	//Obtenemos los datos del formulario para pasarlos al modelo


	let clientes = new Clientes({
	
		nombre: body.nombre,
		apellido: body.apellido,
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
					console.log("expiresIn", expiresIn);

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
					
					registrarToken(id, token, expiresIn, data).then(respuesta => {

						// RUTA DEL METODO activateAccount()
						let link = process.env.RUTAAPI + 'account/active/' + token;
						let linklogo = process.env.RUTAAPI + 'mostrar-logo/logomessage.png';
						let linklogoinstagram = process.env.RUTAAPI + 'mostrar-socialmedia-logo/instagram.png';
						let linklogofacebook = process.env.RUTAAPI + 'mostrar-socialmedia-logo/facebook.png';
						let linklogoyoutube = process.env.RUTAAPI + 'mostrar-socialmedia-logo/youtube.png';
						let linklogotwitter = process.env.RUTAAPI + 'mostrar-socialmedia-logo/twitter.png';

						var mailOptions = {
						from: "Ka Koach",
						to: data.mail,
						subject: "Bienvenid@ a Ka Koach 💪 | 🇨🇱",
						text: body.password,
						html:  `<!doctype html>
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
						    <!--[if !mso]><!-->
						    <style type="text/css">
						      @media only screen and (max-width:480px) {
						      			  		@-ms-viewport {width: 320px;}
						      			  		@viewport {	width: 320px; }
						      				}
						    </style>
						    <!--<![endif]-->
						    <!--[if mso]> 
								<xml> 
									<o:OfficeDocumentSettings> 
										<o:AllowPNG/> 
										<o:PixelsPerInch>96</o:PixelsPerInch> 
									</o:OfficeDocumentSettings> 
								</xml>
								<![endif]-->
						    <!--[if lte mso 11]> 
								<style type="text/css"> 
									.outlook-group-fix{width:100% !important;}
								</style>
								<![endif]-->
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
						      <!--[if mso | IE]>
						<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
						<![endif]-->
						      <div style='background:#EFF3F9;background-color:#EFF3F9;margin:0px auto;max-width:600px;'>
						        <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#EFF3F9;background-color:#EFF3F9;width:100%;'>
						          <tbody>
						            <tr>
						              <td style='direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;'>
						                <!--[if mso | IE]>
						<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
						<![endif]-->
						                <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
						                  <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
						                    <tr>
						                      <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						                        <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:collapse;border-spacing:0px;'>
						                          <tbody>
						                            <tr>
						                              <td style='width:216px;'>
						                                <img alt='Logo' height='189' src='${linklogo}' style='border:none;display:block;font-size:13px;height:189px;outline:none;text-decoration:none;width:100%;' width='216' />
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
						                <!--[if mso | IE]>
						</td></tr></table>
						<![endif]-->
						              </td>
						            </tr>
						          </tbody>
						        </table>
						      </div>
						      <!--[if mso | IE]>
						</td></tr></table>
						<![endif]-->
						      <!--[if mso | IE]>
						<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
						<![endif]-->
						      <div style='background:#000000;background-color:#000000;margin:0px auto;max-width:600px;'>
						        <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#000000;background-color:#000000;width:100%;'>
						          <tbody>
						            <tr>
						              <td style='direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;text-align:center;vertical-align:top;'>
						                <!--[if mso | IE]>
						<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
						<![endif]-->
						                <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
						                  <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
						                    <tr>
						                      <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						                        <table border='0' cellpadding='0' cellspacing='0' style='cellpadding:0;cellspacing:0;color:#000000;font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:40%;' width='40%'>
						                          <tbody>
						                          <!-- LOGOS SOCIALMEDIA DEL MENSAJE DE VERIFICACION -->
						                            <tr align='center'>
						                            <!--
						                                <td align='center'>
						                                <a href='https://www.instagram.com/ka.koach/'>
						                                  <img alt='instagram' height='50px' style='background-color: #343A40;' src='${linklogoinstagram}' width='50px'>
						                                </a>
						                              </td>
						                              <td align='center'>
						                                <a href='/'>
						                                  <img alt='facebook' height='50px' style='background-color: #343A40;' src='${linklogofacebook}' width='50px'>
						                                </a>
						                              </td>
						                              <td align='center'>
						                                <a href='/'>
						                                  <img alt='youtube' height='50px' style='background-color: #343A40;' src='${linklogoyoutube}' width='50px'>
						                                </a>
						                              </td>
						                                <td align='center'>
						                                <a href='/'>
						                                  <img alt='twitter' height='50px' style='background-color: #343A40;' src='${linklogotwitter}' width='50px'>
						                                </a>
						                              </td>
						                              -->
						                            </tr>
						                          </tbody>
						                        </table>
						                      </td>
						                    </tr>
						                  </table>
						                </div>
						                <!--[if mso | IE]>
						</td></tr></table>
						<![endif]-->
						              </td>
						            </tr>
						          </tbody>
						        </table>
						      </div>
						      <!--[if mso | IE]>
						</td></tr></table>
						<![endif]-->
						      <!--[if mso | IE]>
						<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
						<![endif]-->
						      <div style='background:#000000;background-color:#000000;margin:0px auto;max-width:600px;'>
						        <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#000000;background-color:#000000;width:100%;'>
						          <tbody>
						            <tr>
						              <td style='direction:ltr;font-size:0px;padding:20px 0;padding-top:0px;text-align:center;vertical-align:top;'>
						                <!--[if mso | IE]>
						<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
						<![endif]-->
						                <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
						                  <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
						                    <tr>
						                      <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						                        <div style="color:#BBBBBB;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:12px;line-height:1;text-align:center;">
						                          KaKoach © 2021 All Rights Reserved
						                        </div>
						                      </td>
						                    </tr>
						                  </table>
						                </div>
						                <!--[if mso | IE]>
						</td></tr></table>
						<![endif]-->
						              </td>
						            </tr>
						          </tbody>
						        </table>
						      </div>
						      <!--[if mso | IE]>
						</td></tr></table>
						<![endif]-->
						    </div>
						  </body>
						</html>`


						}
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
								console.log("mail enviado")
								return res.json({
									status:200,
									mensaje: "Correo enviado correctamente"
								})
							
							}

						})

					}).catch(respuesta => {
						respuesta["res"].json({
							status: 400,
							mensaje: respuesta["mensaje"]
						})
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
				mensaje: "Error en el servidor",
				err
			})
		}

		if(!data){
			return res.json({
				status: 500,
				mensaje: "El usuario no existe en la base de datos",
				err
			})
		}


		let id = data._id
		/////////////
		const seconds = 60;
		let now = (Date.now()+seconds)/1000;
		let expires = data.tokenExpires;

		if(expires > now){
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


				// res.json({
				// status: 200,
				// mensaje: "El usuario fue validado correctamente"
				// })
				let url = process.env.RUTAHOST + "login/" + data.token;
				console.log("url a angular",url)
				
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
                mensaje: "Error en el servidor",
                err
            })
        }
        //Validamos que el Usuario exista
        if (!data) {
            return res.json({
                status: 400,
                mensaje: "El usuario no existe en la Base de datos",
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
				mensaje: "Error en el servidor",
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
					mensaje: "Error al eliminar al usuario",
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
	}, (err, data) => {
		if(err){
			return res.json({
				status: 500,
				mensaje: "Error en el servidor",
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
	console.log("token", token)
	

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
		let expires = data.tokenExpires;

		let test = expires - now;
		console.log("test", test);

		if(expires < now){
			console.log("el token no ha expirado")
			// TOKEN NO HA EXPIRADO
			res.json({
				status: 200,
				cliente
			})
		}else{
			console.log("el token si ha expirado")
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