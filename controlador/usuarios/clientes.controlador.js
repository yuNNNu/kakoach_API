// IMPORTAMOS EL MODELO
const Clientes = require('../../modelo/usuarios/clientess.modelo');
 require('../../config')
//  Requerimos el móduo para encriptar contraseñas
const bcrypt = require('bcrypt');
const crypto = require ('crypto'); 
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
					let expiresIn = Date.now () + 24 * 3600 * 1000; 

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
						var link = 'http://localhost:4000/account/active/' + token;

						var mailOptions = {
						from: "Ka Koach",
						to: data.mail,
						subject: "Para utilizar su cuenta, porfavor confirmar con el siguiente link",
						text: body.password,
						html: "<h1>Bienvenido a Ka Koach</h1> " + "Para validar su cuenta, haga click aquí: " + link

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
=                    Activar cuenta          =
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

	 	let cambiarRegistrosBd = (data, id) => {
	 		return new Promise((resolve, reject) => {
	 			let datos = {
    			nombre: data.nombre,
    			apellido: data.apellido,
    			mail: data.mail,
    			password: data.password,
    			verified: true,
    			token: data.token,
    			tokenExpires: data.expiresIn
    			}

	            Clientes.findByIdAndUpdate(id, datos, {new:true, runValidators:true},
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


						res.json({
						status: 200,
						mensaje: "El usuario fue validado correctamente"
						})
	            })
			}) 
		}

	 	cambiarRegistrosBd(data, id).then((respuesta) => {
	 		respuesta["res"].json({
	    		status: 200,
	            data: respuesta["data"],
	            mensaje: "El usuario fue validado con éxito"
	    	})
	 	}).catch((respuesta) => {
	 		respuesta["res"].json({

                status: 400,
                err: respuesta["err"],
                mensaje: "Error al validar el usuario"

            })
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
/*=============================================
=                    UPDATE USER             =
=============================================*/
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
					password: bcrypt.hashSync(body.password,10)
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
	updateCliente,
	activateAccount
}