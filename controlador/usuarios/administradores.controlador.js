// IMPORTAMOS EL MODELO
const Administradores = require('../../modelo/usuarios/administradores.modelo');
//requerimos para toke
const jwt = require('jsonwebtoken')
//  Requerimos el móduo para encriptar contraseñas
const bcrypt = require('bcrypt');
/*=============================================
=                     GET                     =
=============================================*/


let mostrarData = (req, res) => {

	Administradores.find({}).exec((err, data) => {
		if(err){
			return res.json({
				status: 500,
				mensaje: "Error en la peticion"
			})		
		}

		// Mostrar conteo de indices que existen en mongoose y retorno de los datos
		Administradores.countDocuments({}, (err, total) => {
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


	//Obtenemos los datos del formulario para pasarlos al modelo

	let administradores = new Administradores({
	
		user: body.user,
		password: bcrypt.hashSync(body.password,10)
	})

	//Guardamos en MongoDB

	administradores.save((err, data)=>{

		if(err){

			return res.json({
				status:400,
				mensaje: "Error al almacenar al administrador",
				err
			})

		}

		res.json({

			status:200,
			data,
			mensaje:"El administrador ha sido creado con éxito"

		})

	})

}
/*========================
FUNCION LOGIN
========================== */
let login = (req, res) => {
    //Obtenemos el cuerpo del formulario
    let body = req.body;
    //Recorremos la base de datos en busqueda de coincidencia con el usuario
    Administradores.findOne({
        user: body.user
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
        if (body.password != data.password) {
            return res.json({
                status: 400,
                mensaje: "La contraseña es incorrecta",
                err
            })
		}
        //Generamos TOKEN de autorizacion, que dure 30 dias
        let token = jwt.sign({
            data
        }, process.env.SECRET, {
            expiresIn: process.env.CADUCIDAD
        })

        res.json({
			status: 200,
			token
        })
    })
}


/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    mostrarData,
	crearData,
	login
}