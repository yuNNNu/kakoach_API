
const endpoint= 'https://webpay3gint.transbank.cl/'
const path = "rswebpaytransaction/api/webpay/v1.0/transactions";
let url = endpoint + path;
const axios = require('axios');
const Webpay = require('./modelo/webpay.modelo')

// CODIGO NICO

const headers = {
    'Tbk-Api-Key-Id' : '597055555532',
    'Tbk-Api-Key-Secret' : '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
    'Content-Type' : 'application/json'
}

let key;

let pagar = (req, res) =>
{
    let body = req.body;
    axios.post(url, {
    "buy_order": body.buy_order,
     "session_id": body.session_id,
     "amount": body.amount,
     "return_url": body.return_url
    }, {
        headers : headers
    }).then(data =>
    {   key = data.data.token;
        res.status(200).send({
           url: data.data.url + '?token_ws=' + data.data.token
        })
        console.log("desde controller",data.data);
    }).catch(err =>
    {
        console.log(err);
    })
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
        axios.get(url + "/" + key, {
            headers:headers
        }).then(response =>
        {
            console.log("get commit", response)
        }).catch(err =>
        {
             console.log(err);
        })
        console.log(response.data);
      
    }).catch(err => {
        console.log(err);
    })


}

module.exports = {
    pagar,
    commit
}