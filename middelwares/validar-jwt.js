const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validarJWT = (req = request, res = response, next) =>{

    const token = req.header('z-token');
    if (!token) {
        return res.status(401).json({
            msg:'No hay token en la petición- token'
        })
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // validacion usuario autenticado
        const userAuth = User.findById( uid );

        //Validacion del usuario exite
        if (!userAuth) {
            return res.status(401).json({
                msg:'Token no válido'
            });
        }

        //validacion de que el status este en true para su delete
        if (!userAuth) {
            return res.status(401).json({
                msg:'Token no válido'
            });
        }

        req.userAuth = userAuth;

        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg:'No hay token en la petición - error'
        });
    }

}

module.exports = {
    validarJWT
}