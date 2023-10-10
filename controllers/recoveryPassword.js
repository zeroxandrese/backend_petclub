const { response, query } = require('express');
const { Resend } = require('resend');
let MersenneTwister = require('mersenne-twister');
let generator = new MersenneTwister();

const { RecoveryPassword, User } = require('../models/index');

const recoveryPasswordPostValidation = async (req, res = response) => {

    const resend = new Resend(process.env.RESENDKEY);

    const email = req.params.email;
    if (!email) {
        return res.status(401).json({
            msg: 'Necesita enviar un email'
        })
    };

    try {

        const repeatValidation = await RecoveryPassword.findOne({ email });

        if (repeatValidation) {
            return res.status(401).json({
                msg: 'El usuario tiene un codigo activo'
            })
        }

        const userValidation = await User.findOne({ email });

        const { nombre } = userValidation;

        code = Math.floor(generator.random() * 9000) + 1000;

        const data = {
            user: userValidation,
            code
        }

        const recoveryPassword = new RecoveryPassword(data);
        await recoveryPassword.save();

        const data2 = await resend.emails.send({
            from: "PetClub <petclub@resend.dev>",
            to: `${email}`,
            subject: "Recupera tu clave de acceso en petClub",
            html: `<p>Hola ${nombre}.</p></br>
            <p>Código de Verificación para Recuperar Contraseña en petClub: <strong>${code}</strong></p></br>
            <p>¡Gracias por ser parte de PetClub, la comunidad de amantes de las mascotas!.</p>`,
        });
        console.log(data2)
        res.status(201).json(recoveryPassword);
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = {
    recoveryPasswordPostValidation
};