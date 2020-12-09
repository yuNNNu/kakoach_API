const jwt = require('jsonwebtoken');
/*==========================================
    VERIFICAR TOKEN
============================================ */
let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    //validar token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.json({
                status: 401,
                mensaje: "El token no es valido",
                err
            })
        }
        req.usuario = decoded.usuario;
        next();
    })
}

//exportar
module.exports = {
    verificarToken
}