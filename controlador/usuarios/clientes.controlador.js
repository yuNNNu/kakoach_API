// IMPORTAMOS EL MODELO
const Clientes = require('../../modelo/usuarios/clientes.modelo');
 require('../../config')
//  Requerimos el móduo para encriptar contraseñas
const bcrypt = require('bcrypt');
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

let updateCliente = (req, res) => {

	let id = req.params.id;
	let body = req.body;

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
				mensaje: "No existe usuario en la BD",
				err
			})
		}

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
					password: password
					// password: bcrypt.hashSync(body.password,10)
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
		            data: respuesta["data"],
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

/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    mostrarData,
	crearData,
	loginCliente,
	deleteCliente,
	updateCliente
}