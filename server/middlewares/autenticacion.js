const jwt = require('jsonwebtoken');

// Verificar token

let verificaToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                error: err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

// Verificar role

let verificaRole = (req, res, next) => {

    let role = req.usuario.role;

    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            role,
            error: {
                message: 'permiso inválido'
            }
        });       
    }

    next();


};

module.exports = {
    verificaToken,
    verificaRole
};