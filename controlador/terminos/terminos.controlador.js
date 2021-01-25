/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const terminos = require('../../modelo/terminos/terminos.modelo')

/*=============================================
FUNCIÓN GET
=============================================*/

let showTerminos = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	terminos.find({})
        .exec((err, data) =>
        {
           

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		terminos.countDocuments({}, (err, total)=>{

			if(err){

				return res.json({

					status:500,
					mensaje: "Error en la petición"

				})
			}

			res.json({
				status: 200,
				total,
				data
			})

		})

	}) 

}
/*=============================================
FUNCIÓN PUT
=============================================*/
let updateTerminos = (req, res) =>
{
    // caputaramos id de beneficio
    let id = req.params.id;
    // obtenemos el cuerpo del formulario
    let body = req.body;
    if ( body.contenido == "")
    {
        return res.json({
            status: 400,
            mensaje: "El contenido no puede ir vacio",
            
        })
        
    }
   
    const contenido = body.contenido

    
   
    //01  VALIDAMOS EXISTENCIA DE BENEFICIO
    terminos.findById(id, (err, data) =>
    {       
            //Validammos que no haya error
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en la petición",
                err
            })
        }
        //Validamos que la beneficio exista
        if (!data) {
            return res.json({
                status: 404,
                mensaje: "No existe la información en la base de datos",
                err
            })
        }
    
        
    // 03 ACTUALIZAR REGISTROS
        


    let datosterminos = {
        contenido: contenido
    }
      
    //Actualizamos en MongoDB
    //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    terminos.findByIdAndUpdate(id, datosterminos, {
        new: true, // Con esto me muestra lo que se guardo y no el antiguo
        runValidators: true // Con esto me muestra lo que se guardo y no el antiguo           
    }, (err, data) =>
    {
           
        if (err) {
            
            return res.json({
            status: 400,
            mensaje: "Error al actualizar modulo",
            
            })
        }

        return res.json({
            status: 200,
            mensaje: "Modulo editado exitosamente!",
            
        })
    })
                
    
    
            
    })
    
}
/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
 
    updateTerminos,
    showTerminos
}