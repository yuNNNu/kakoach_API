
const axios = require('axios');
const Venta = require('../../modelo/webpay/registroVenta/venta.modelo')
const planes = require('../../modelo/planes/planes.modelo');
require('../../config')
let All = (req, res) =>
{
 
 
  Venta.find({}).exec((err, data) => {
    // Si ocurre un error
    if (err) {
      return res.json({
        status: 500,
        mensaje: "Error en la petición",
      });
    }

    // inicializacion de variable  total
    let total = 0;
    let planesEnRango = [];
    let PlanesFilter = [];
    
    // Llenamos dos arreglos 1 de todos los planes y hasta repetidos y 1 arreglo de planes no repetidos
    data.map((x) => {
      let fecha = Date.parse(x.fecha_venta);
      // fechas que deben ser recepcionadas con req.body
      var dMenor = Date.parse("2021/01/01");
      var dMayor = Date.parse("2021/01/06");

      if (fecha >= dMenor && fecha <= dMayor) {
        total = x.precio + total;

        planesEnRango.push({ id: x.id_plan,
                            nombre: x.nombre_plan});

        if (!PlanesFilter.includes(x["id_plan"])) {
          PlanesFilter.push(x.id_plan);
        }
      
      }
    });

    // Contamos la cantidad por plan vendido, retorna arr con obj de idPlan y cantidad
    let planesYCantidad = PlanesFilter.map((idPlan) => {
      var cont = 0;
      var nombre = "";
      
      planesEnRango.forEach((plan) => {
        if (plan["id"] == idPlan) {
          cont++;
          nombre= plan["nombre"]
        }
      });
        
  
        let obj = {
          nombre: nombre,
          cantidad: cont,
          id: idPlan
        };

      return obj;
    });

    // ordenamos planes de mayor cant a menor
    planesYCantidad.sort((a, b) => {
      return b.cantidad - a.cantidad;
    });

    const largo = planesYCantidad.length;
    const cantVentas = planesEnRango.length;

    res.json({
      status: 200,
      cantidad_ventas: cantVentas,
      total_ventas: total,
      mas_vendido: planesYCantidad[0],
      menos_vendido: planesYCantidad[largo - 1],
      planes_y_cantidad: planesYCantidad,
    });
  });

  

}


/*========================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
========================== */
module.exports = {
    All
}