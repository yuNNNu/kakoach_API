var nodemailer = require("nodemailer")

let sendEmail = (req, res) =>
{
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
        to: "lucianoma63@gmail.com",
        subject: "Enviado desde nodemailer",
        text: "Bienvenidos a Ka Koach",
        html: "<h1>HOLA</h1>"

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