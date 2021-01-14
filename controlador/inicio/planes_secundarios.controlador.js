/*=============================================
IMPORTAMOS EL MODELO
=============================================*/
const planes = require('../../modelo/planes/planes.modelo');
const plan = require('../../modelo/inicio/planes_secundarios.modelo')
/*=============================================
FUNCIÓN GET
=============================================*/
let showPlan = (req, res) =>
{
    //https://mongoosejs.com/docs/api.html#model_Model.find
    plan.find({})
        .exec((err, data) =>
        {
         
            if(err){

                return res.json({

                status:500,
                mensaje: "Error en la petición"

                })
            }

            //Contar la cantidad de registros
            plan.countDocuments({}, (err, total)=>{

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
let updateSecondaryPlan = (req, res) =>
{
    // caputaramos id de beneficio
    let _id = req.params.id;
    // obtenemos el cuerpo del formulario
    let body = req.body;
    let idPlan = body.id;
    //01  VALIDAMOS EXISTENCIA DE BENEFICIO
    plan.findById(_id, (err, data) =>
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
                mensaje: "No existe el plan en la base de datos",
                err
            })
        }
       
        // 02 VALIDAR CAMBIO
        let validarCambio = (_id, idPlan) => {
          return new Promise((resolve, reject) => {
            let datosplan = {
              id: idPlan,
            };
              
              planes.findById(idPlan, (err, data) =>
              {
                
                if (err) {
                    let respuesta = {
                    res: res,
                    mensaje: "Error en el servidor o el id es invalido",
                    };
                    reject(respuesta);
                }
                if (!data)
                {
                    
                    let respuesta = {
                    res: res,
                    mensaje: "No existe el plan ingresado",
                    };
                    reject(respuesta);
                    
                }
                resolve(idPlan)
            })
           
          });
        };   
        // 03 ACTUALIZAR REGISTROS

        let cambiarRegistroBD = (_id, idPlan) =>
        {
            return new Promise((resolve, reject) =>
            {
                let datosplan = {
                    id : idPlan
                }
                //Actualizamos en MongoDB
                //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
                plan.findByIdAndUpdate(_id, datosplan, {
                    new: true, // Con esto me muestra lo que se guardo y no el antiguo
                    runValidators: true // Con esto me muestra lo que se guardo y no el antiguo           
                }, (err, data) =>
                {
                    if (err) {
                        let respuesta = {
                        res: res,
                        error: err
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
        // SINCRONIZACION
        validarCambio(_id, idPlan).then(idPlan =>
        {
            cambiarRegistroBD(_id, idPlan).then(respuesta =>
            {
                
                respuesta["res"].json({
                status: 200,
                data: respuesta["data"],
                mensaje: "El plan fue actualizado cone exito!"
                })
            }).catch((respuesta =>
            {
                respuesta["err"].json({
                status: 400,
                err: respuesta["err"],
                mensaje: "Error al editar el plan personal"
                })
            }))

        }).catch(respuesta =>
        {
                respuesta["res"].json({
                status:400,
                mensaje:respuesta["mensaje"]

            })
        })





            
    })
}
/*=============================================
FUNCIÓN POST
=============================================*/
let createData = (req, res) => {
    
    let body = req.body;

    //Obtenemos los datos del formulario para pasarlos al modelo

    let datosPlan = new plan({
    
        id : body.id
    })

    //Guardamos en MongoDB

    datosPlan.save((err, data)=>{

        if(err){

            return res.json({
                status:400,
                mensaje: "Error al almacenar el id de los planes secundarios",
                err
            })

        }

        res.json({

            status:200,
            data,
            mensaje:"El módulo ha sido creado con éxito"

        })

    })

}

/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    showPlan,
    updateSecondaryPlan,
    createData
}

