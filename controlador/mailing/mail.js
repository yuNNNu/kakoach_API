var nodemailer = require("nodemailer")
const Clientes = require('../../modelo/usuarios/clientess.modelo');
require('../../config')
// MAIL DE COMPRA CON PDF
let sendEmail = (req, res) =>
{
    email = process.env.MAIL;
    pass = process.env.PASS;
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: pass
        }
    })

    body = req.body;
    pdf = body.pdf;
    emailUser = body.emailUser;
    
    console.log(" Enviado email")
    // AQUI DEBEMOS ENVIAR EL CORREO AL MAIL REGISTRADO POR EL USUARIO, desde el req.body
    var mailOptions = {
        from: "KA KOACH",
        to: emailUser,
        subject: "COMPRA EXITOSA",
        text: "Bienvenidos a Ka Koach",
        html: '<p>Compra realizada con exito</p> <h1> Que lo disfrute</h1><p>Gracias por su compra</p> ',
            
        attachments: [
              {   // binary buffer as an attachment
            filename: pdf,
            path: process.env.RUTAAPI+"show-pdf-plan/"+  pdf       
         }
            
        ]

    }
    transporter.verify().then(() =>
    {
        console.log('Listo para enviar  el correo de  venta')
    })

    transporter.sendMail(mailOptions, (err, info) =>
    {
        if (err)
        {
            res.status(500).send(err.message);
        } else
        {
            console.log("Email enviado correctamente");
            res.status(200).jsonp(req.body);
        }

    })
}
// MAIL DE CONTACTO
let ContactMeMail = (req, res) =>
{
    email = process.env.MAIL;
    pass = process.env.PASS;
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: pass
        }
    })

    body = req.body;
    message = body.message;
    emailUser = body.emailUser;
    var expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
	var esValido = expReg.test(emailUser);
	if (!esValido)
	{
		return res.json({
			status:400,
			mensaje: "Error, formato de correo invalido",
			
		})
	}
    nombreCliente = body.nombre;
    apellidoCliente = body.apellido;
    console.log(" iniciando proceso de envio de  email de contactame")
    // AQUI DEBEMOS ENVIAR EL CORREO AL MAIL REGISTRADO POR EL USUARIO, desde el req.body
    var mailOptions = {
        from: "KA KOACH",
        to: email,
        subject: "CONTACTA ESTE CORREO",
        text: `Nombre cliente:\n${ nombreCliente } ${ apellidoCliente }\nResponder a: ${ emailUser }\nMensaje:\n${ message } `

    }
    transporter.verify().then(() =>
    {
        console.log('Listo para enviar  el correo de  contactame')
    })

    transporter.sendMail(mailOptions, (err, info) =>
    {
        if (err)
        {
            return res.json({
			status:400,
			mensaje: "Error, formato de correo invalido",
			err
		    })
        } else
        {
            console.log("Email enviado correctamente");
            res.status(200).jsonp({req: req.body, status:200});
        }

    })
}

let recuperarPass = (req, res) => {

    email = process.env.MAIL;
    pass = process.env.PASS;
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: pass
        }
    })

    body = req.body;
    emailUser = body.mail;

    Clientes.findOne({
        mail: emailUser
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
                mensaje: "El mail ingresado no está registrado",
                err
            })
        }

        let token = data.token;

            console.log(" Enviado email")
            // AQUI DEBEMOS ENVIAR EL CORREO AL MAIL REGISTRADO POR EL USUARIO, desde el req.body
            //`<a href="http://localhost:4200/nueva-password/${token}">recuperar pass</a>`
            let link = process.env.RUTAHOST + 'nueva-password/' + token;
            let linklogo = process.env.RUTAAPI + 'mostrar-logo/logomessage.png';
            let linklogoinstagram = process.env.RUTAAPI + 'mostrar-socialmedia-logo/instagram.png';
            let linklogofacebook = process.env.RUTAAPI + 'mostrar-socialmedia-logo/facebook.png';
            let linklogoyoutube = process.env.RUTAAPI + 'mostrar-socialmedia-logo/youtube.png';
            let linklogotwitter = process.env.RUTAAPI + 'mostrar-socialmedia-logo/twitter.png';

            var mailOptions = {
                from: "KA KOACH",
                to: data.mail,
                subject: "CAMBIO DE CONTRASEÑA",
                text: "Bienvenidos a Ka Koach",
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
                                                    @viewport {    width: 320px; }
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
                                                  Recuperación de contraseña
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                                <div style="color:#000000;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;line-height:20px;text-align:center;">
                                                Para completar el cambio de contraseña de tu cuenta KaKoach. Es simple, sólo haz click en el botón de abajo.
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;' vertical-align='middle'>
                                                <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:separate;line-height:100%;width:200px;'>
                                                  <tr>
                                                    <td align='center' bgcolor='#0061F2' role='presentation' style='background-color:#0061F2;border:none;border-radius:4px;cursor:auto;padding:10px 0px; width: auto;' valign='middle'>
                                                      <a href='${link}' style="background:#0061F2;color:#ffffff;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;font-weight:bold;line-height:30px;margin:0;text-decoration:none;text-transform:none;" target='_blank'>
                                                        Cambiar contraseña
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
                console.log('Listo para enviar  el correo de  venta')
                return res.json({
                    status: 200,
                    mail: data.mail
                })
            })

            transporter.sendMail(mailOptions, (err, info) =>
            {
                if (err)
                {
                    return res.json({
                        status: 500,
                        err: err.message
                    })
                } else
                {
                    console.log("Email enviado correctamente");
                }

            })


    })
    
}


/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    sendEmail,
    ContactMeMail,
    recuperarPass
}