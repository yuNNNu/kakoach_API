// IMPORTAMOS EL MODELO
const Clientes = require('../../modelo/usuarios/clientes.modelo');
const Auth = require('./../mailing/auth.mail')
//  Requerimos el móduo para encriptar contraseñas
const bcrypt = require('bcrypt');
var nodemailer = require("nodemailer")
// base mail
var transporter = nodemailer.createTransport({
host: 'smtp.gmail.com',
port: 465,
secure: true,
auth: {
	user: 'lucianoma63@gmail.com',
	pass: 'leqkigxahlawknxl'
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

	//Obtenemos los datos del formulario para pasarlos al modelo


	let cliente = new Clientes({
	
		nombre: body.nombre,
		apellido: body.apellido,
		mail: body.mail,
		password: bcrypt.hashSync(body.password,10)
	})

	//Guardamos en MongoDB

	cliente.save((err, data)=>{

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
			mensaje:"El usuario ha sido creado con éxito"

		})


		var mailOptions = {
			from: "Ka Koach",
			to: mail,
			subject: "Cuenta creada con exito",
			text: body.password,
			html: "<h1>Bienvenido a Ka Koach</h1> " + "pass: " + body.password

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
			
			}

		})

	})

}
/*========================
FUNCION LOGIN
========================== */
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
            mensaje: "ok"
        })
    })
}

/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    mostrarData,
	crearData,
	loginCliente
}