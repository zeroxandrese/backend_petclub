const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJwt } = require('../helpers/generate-jwt');


const login = async (req, res = response) =>{

    const { email, password } = req.body;

    try {
        // Validacion correo existe?
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                msg:'El email / Password son incorrectos'
            });
        }
        //Validacion usuario activo?
        if(!user.status){
            return res.status(400).json({
                msg:'El email / Password son incorrectos'
            });
        }
        //Validacion password
        const findPassword = bcryptjs.compareSync( password, user.password);
        if(!findPassword){
            return res.status(400).json({
                msg:'El email / Password son incorrectos'
            });
        }
        //Generar JWT
        const token = await generateJwt( user.id );

        res.json({
            user,
            token
        });
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg:'Algo salio mal, contacte con el administrador'
        })
    }
}

module.exports = {
    login
}