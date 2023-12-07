const jwt = require('jsonwebtoken');
const { User } = require('../models/index');


const generateJwt = (uid = '') => {

    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '7d'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        }
        );
    });
}

const verifyToken = async (token = '') => {

    try {
        if (token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const usuario = await User.findById(uid);
        if (!usuario) {
            return null;
        } else {
            return usuario
        }

    } catch (error) {
        return null;
    }
}

module.exports = {
    generateJwt,
    verifyToken
};