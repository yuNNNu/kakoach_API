var nodemailer = require("nodemailer")
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
    token = req.params.token;
    emailUser = body.emailUser;
    
    console.log(" Enviado email")
    // AQUI DEBEMOS ENVIAR EL CORREO AL MAIL REGISTRADO POR EL USUARIO, desde el req.body
    var mailOptions = {
        from: "KA KOACH",
        to: emailUser,
        subject: "CAMBIO DE CONTRASEÑA",
        text: "Bienvenidos a Ka Koach",
        html: '<a>`${process.env.RUTAAPI}/editar-cliente/${token}`</a> <h1> Que lo disfrute</h1><p>Gracias por su compra</p> ',
            
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


/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    sendEmail,
    ContactMeMail,
    recuperarPass
}