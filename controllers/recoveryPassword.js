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

        const repeatValidation = await RecoveryPassword.findOne({ email, status: true });

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
            from: "PetClub <admin@petclub.com.pe>",
            to: `${email}`,
            subject: "Recupera tu clave de acceso en petClub",
            html: `    <html>
            <head>
                <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }
        
                .container {
                    background: linear-gradient(135deg, #4CC9F0 0%, #7209B7 100%);
                    padding: 90px 35%; /* Relleno vertical y relleno horizontal */
                }
        
                .content {
                    background: #FFFFFF;
                    padding: 20px;
                }
        
                .code {
                    font-size: 26px;
                    letter-spacing: 4px;
                    text-align: center;
                }
        
                @media screen and (max-width: 600px) {
                    .container {
                        background: linear-gradient(135deg, #4CC9F0 0%, #7209B7 100%);
                        padding: 50px 5%;
                    }
        
                    .code {
                        font-size: 20px;
                        text-align: center
                    }
                }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <p>Hola ${nombre}.</p>
                        <p>Código de Verificación para Recuperar Contraseña en petClub:</p>
                        <p class="code"><strong>${code}</strong></p>
                        <p>¡Gracias por ser parte de PetClub, la comunidad de amantes de las mascotas!</p>
                        <p>NOVAMATRIX | Lima - Perú</p>
                    </div>
                </div>
            </body>
            </html>`,
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