// IMPORTAMOS EL MODELO
const Clientes = require('../../modelo/usuarios/clientes.modelo');
//  Requerimos el móduo para encriptar contraseñas
const bcrypt = require('bcrypt');
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
        if (body.password != data.password) {
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