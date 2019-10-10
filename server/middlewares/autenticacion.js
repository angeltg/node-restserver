const jwt = require('jsonwebtoken');



// ===============
// Vericar token
// ===============


let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            })
        }
        req.usuario = decoded.usuario;

        next();
    });

};

// ===============
// Vericar role
// ===============


let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role != "ADMIN_ROLE") {
        return res.status(403).json({
            ok: false,
            err: {
                message: "Sólo el administrador puede crear usuarios"
            }
        });
    }
    next();
};

module.exports = { verificaToken, verificaAdmin_Role };