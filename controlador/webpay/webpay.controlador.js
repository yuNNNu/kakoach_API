
const endpoint= 'https://webpay3gint.transbank.cl/'
const path = "rswebpaytransaction/api/webpay/v1.0/transactions";
let url = endpoint + path;
const axios = require('axios');
// modelo de webpay
const Webpay = require('./modelo/webpay.modelo')
// modelo de la venta
const Venta = require('../../modelo/webpay/registroVenta/venta.modelo')
// Comunicacion en real-time entre servidor y browser
var SocketSingleton = require('../webpay/singleton/socket-singletion');

const headers = {
    'Tbk-Api-Key-Id' : '597055555532',
    'Tbk-Api-Key-Secret' : '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
    'Content-Type' : 'application/json'
}

let key;
let nuevonum=()=>{
    const now = Date.now()
    const nAzar = Math.round(Math.abs(Math.random() + 0.5) * 10000000000);
    let nro = ("" + now + nAzar);
    return nro
}
let pagar = (req, res) =>
{
    let nro = nuevonum();
    if (nro.length >= 26)
    {
        nro = nuevonum();
    }
    else
    {
        Venta.findOne({ "nro_venta": nro }).then(result =>
        {
            
            if (result != null)
            {   
                nro = nuevonum();
                if (nro.length >= 26)
                {
                    nro = nuevonum();
                }
                console.log(" existe")
            } 
            
            console.log("🚀 ~ file: webpay.controlador.js ~ line 46 ~ nro", nro)
                // antes de filtrar nro
                let body = req.body;
                axios.post(url, {
                "buy_order": nro,
                "session_id": nro,
                "amount": body.amount,
                "return_url": body.return_url
                }, {
                    headers : headers
                }).then(data =>
                {   key = data.data.token;
                    res.status(200).send({
                        url: data.data.url + '?token_ws=' + data.data.token,
                        token:data.data.token
                    })
                }).catch(err =>
                {
                    
                    console.log(err);
                })
            
        })
    }

}

let commit = (req, res) => {

    // let token = req.body.token_ws;
    let pago = new Webpay({
        key: key
    });
    axios.put(url + "/" + key, null, {
        headers: headers
    }).then(response =>
    {    

        SocketSingleton.io.emit('paid', JSON.stringify(response.data));
        res.send('<script>window.close();</script>')
        pago.save((err, data) =>
        {
            if (err) {
            return ({
                status: 400,
                mensaje: "Error al almacenar el token webpay",
                err,
            });
            }

       
        })
        
      
    }).catch(err => {
        console.log(err);
    })


}
/*=============================================
=      PETICION POST REGISTRAR COMPRA           =
=============================================*/
// el nro_ventas es el buy_order en pagar()
let RegistrarCompras = (req, res) => {
	let body = req.body;
    let venta = new Venta({
        email: body.mail,
        nombre_plan: body.nombre_plan,
        id_plan: body.id,
        precio:body.precio,
        nro_venta: body.nro_venta,
        fecha_venta: body.fecha_venta,
        session_id: body.session_id,
        token: body.token
    })

         //Guardamos en MongoDB

    venta.save((err, data) => {
        if (err) {
        return res.json({
            status: 400,
            mensaje: "Error al registrar la venta",
            err,
        });
        }

        res.json({
        status: 200,
        data,
        mensaje: "La venta fue creada con éxito",
        });
    });

}
/*=============================================
=      PETICION GET  COMPRA           =
=============================================*/


let showVentas = (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	Venta.find({})
        .exec((err, data) =>
        {
           

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
		Venta.countDocuments({}, (err, total)=>{

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
module.exports = {
    pagar,
    commit,
    RegistrarCompras,
    showVentas

}