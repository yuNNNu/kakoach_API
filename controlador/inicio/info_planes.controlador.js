/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const info_planes = require('../../modelo/inicio/info_planes.modelo')

/*=============================================
FUNCIÓN GET
=============================================*/

let showinfo_planes = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	info_planes.find({})
        .exec((err, data) =>
        {
           

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		info_planes.countDocuments({}, (err, total)=>{

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
let updateInfoPlanes = (req, res) =>
{
    // caputaramos id de beneficio
    let id = req.params.id;
    // obtenemos el cuerpo del formulario
    let body = req.body;
    if (body.titulo == "" || body.descripcion == "")
    {
        return res.json({
            status: 400,
            mensaje: "El titulo o la descripción no pueden ir vacias",
            
        })
        
    }
    const titulo = body.titulo;
    const descripcion = body.descripcion

    
   
    //01  VALIDAMOS EXISTENCIA DE BENEFICIO
    info_planes.findById(id, (err, data) =>
    {       
            //Validammos que no haya error
        if (err) {
            return res.json({
                status: 500,
                mensaje: "Error en el servidor",
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
        


    let datosinfo_planes = {
        titulo: titulo,
        descripcion: descripcion
    }
      
    //Actualizamos en MongoDB
    //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    info_planes.findByIdAndUpdate(id, datosinfo_planes, {
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
 
    updateInfoPlanes,
    showinfo_planes
}