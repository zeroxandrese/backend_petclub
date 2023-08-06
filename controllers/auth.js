const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const User = require('../models/user');
const { generateJwt } = require('../helpers/generate-jwt');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        // Validacion correo existe?
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'El email / Password son incorrectos'
            });
        }
        //Validacion usuario activo?
        if (!user.status) {
            return res.status(400).json({
                msg: 'El email / Password son incorrectos'
            });
        }
        //Validacion password
        const findPassword = bcryptjs.compareSync(password, user.password);
        if (!findPassword) {
            return res.status(400).json({
                msg: 'El email / Password son incorrectos'
            });
        }
        //Generar JWT
        const token = await generateJwt(user.id);

        res.json({
            user,
            token
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Algo salio mal, contacte con el administrador'
        })
    }
};

const googleLogin = async (req, res) => {
    const { googleToken } = req.body;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    try {
        // Verificar el token de Google usando la librería google-auth-library
        const client = new OAuth2Client(googleClientId);
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: googleClientId
        });

        const payload = ticket.getPayload();
        const googleUserId = payload.sub;
        // Verificar si el usuario ya está registrado en tu base de datos
        let user = await User.findOne({ googleUserId });

        //Creacion del usuario si la informacion no existe
        if (!user) {
            const { email, name, picture } = payload;
            user = new User({
                email: email,
                nombre: name,
                img: picture,
                google: true,
                googleUserId,
            });
            await user.save();
        };

        const userId = user.uid;

        //Generar JWT
        const token = await generateJwt(userId);

        res.json({
            user,
            token
        });

    } catch (error) {
        console.error('Error al autenticar con Google:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

module.exports = {
    login,
    googleLogin
}