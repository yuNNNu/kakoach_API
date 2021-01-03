process.env.PORT = process.env.PORT || 4000;
/*==================================================================
CREO VARIABL SECRET PARA TOKEN
==================================================================== */
process.env.SECRET = "nopainnogain";
/*==================================================================
Variable caducidad de TOKEN
==================================================================== */
process.env.CADUCIDAD = 60 * 60 * 24 * 30;

process.env.RUTAAPI = 'http://localhost:4000/';
process.env.MAIL = 'lucianoma63@gmail.com';
process.env.PASS = 'leqkigxahlawknxl'

/*==================================================================
HTML DE MAIL DE ACTIVACION DE CUENTA
==================================================================== */


process.env.ACTIVATEMAIL = `<!doctype html>
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
						                                <img alt='Logo' height='189' src='${process.env.RUTAAPI}/mostrar-logo/logomessage.png' style='border:none;display:block;font-size:13px;height:189px;outline:none;text-decoration:none;width:100%;' width='216' />
						                              </td>
						                            </tr>
						                          </tbody>
						                        </table>
						                      </td>
						                    </tr>
						                    <tr>
						                      <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						                        <div style="color:#000000;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:36px;line-height:1;text-align:center;">
						                          Bienvenido!
						                        </div>
						                      </td>
						                    </tr>
						                    <tr>
						                      <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
						                        <div style="color:#000000;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;line-height:20px;text-align:center;">
						                          Confirma tu dirección de correo electrónico para completar la validación de tu cuenta KaKoach. Es simple, solo haz click en el botón de abajo.
						                        </div>
						                      </td>
						                    </tr>
						                    <tr>
						                      <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;' vertical-align='middle'>
						                        <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:separate;line-height:100%;width:200px;'>
						                          <tr>
						                            <td align='center' bgcolor='#0061F2' role='presentation' style='background-color:#0061F2;border:none;border-radius:4px;cursor:auto;padding:10px 25px;' valign='middle'>
						                              <a href='https://example.com' style="background:#0061F2;color:#ffffff;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;font-weight:bold;line-height:30px;margin:0;text-decoration:none;text-transform:none;" target='_blank'>
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
						                                  <img alt='instagram' height='50px' style='background-color: #343A40;' src='${process.env.RUTAAPI}/mostrar-socialmedia-logo/instagram.png' width='50px'>
						                                </a>
						                              </td>
						                              <td align='center'>
						                                <a href='/'>
						                                  <img alt='facebook' height='50px' style='background-color: #343A40;' src='${process.env.RUTAAPI}/mostrar-socialmedia-logo/facebook.png' width='50px'>
						                                </a>
						                              </td>
						                              <td align='center'>
						                                <a href='/'>
						                                  <img alt='youtube' height='50px' style='background-color: #343A40;' src='${process.env.RUTAAPI}/mostrar-socialmedia-logo/youtube.png' width='50px'>
						                                </a>
						                              </td>
						                                <td align='center'>
						                                <a href='/'>
						                                  <img alt='twitter' height='50px' style='background-color: #343A40;' src='${process.env.RUTAAPI}/mostrar-socialmedia-logo/twitter.png' width='50px'>
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
