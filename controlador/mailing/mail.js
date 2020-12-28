var nodemailer = require("nodemailer")

let sendEmail = (req, res) =>
{
    body = req.body;
    pdf = body.pdf;
    emailUser = body.emailUser;
    console.log("Email enviado")
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'lucianoma63@gmail.com',
            pass: 'leqkigxahlawknxl'
        }
    })
    // AQUI DEBEMOS ENVIAR EL CORREO AL MAIL REGISTRADO POR EL USUARIO, desde el req.body
    var mailOptions = {
        from: "Ka Koach",
        to: emailUser,
        subject: "COMPRA EXITOSA",
        text: "Bienvenidos a Ka Koach",
        html: '<p>Compra realizada con exito</p> <h1> Que lo disfrute</h1><p>Gracias por su compra</p> ',
            
        attachments: [
              {   // binary buffer as an attachment
            filename: pdf,
            path: 'http://localhost:4000/show-pdf-plan/'+pdf
        }
        ]

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
            console.log("Email enviado correctamente");
            res.status(200).jsonp(req.body);
        }

    })
}
/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    sendEmail
}