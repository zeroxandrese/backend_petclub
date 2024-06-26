import { response, query } from 'express';
import { Resend } from 'resend';
import MersenneTwister from 'mersenne-twister';
import * as dotenv from 'dotenv';
dotenv.config();

import { generateJwt } from '../helpers/generate-jwt';

let generator = new MersenneTwister();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const recoveryPasswordPost = async (req: any, res = response) => {

    const { code } = req.body;
    const email = req.params.email;
    const user = await prisma.user.findUnique({ where: { email } })
    if (!code) {
        return res.status(401).json({
            msg: 'Necesita enviar un código'
        })
    };

    if (!user) {
        return res.status(401).json({
            msg: 'Error con el usuario'
        })
    };

    try {
        const resp = await prisma.recoveryPassword.findFirst({
            where: {
                user: user.uid, status: true, code: code
            }
        });

        //Generar JWT
        const token = await generateJwt(user.uid);

        if (resp) {
            res.status(201).json({
                uid: user.uid,
                msg: 'Código autorizado',
                token
            });
        } else {
            res.status(401).json({
                msg: 'Código no autorizado'
            });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const recoveryPasswordPostValidation = async (req: any, res = response) => {

    const resend = new Resend(process.env.RESENDKEY);

    const email = req.params.email;
    if (!email) {
        return res.status(401).json({
            msg: 'Necesita enviar un email'
        })
    };

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                msg: 'Email no registrado'
            })
        };

        const repeatValidation = await prisma.recoveryPassword.findFirst({ where: { user: user.uid, status: true } });

        if (repeatValidation) {
            return res.status(401).json({
                msg: 'El usuario tiene un codigo activo'
            })
        }

        const { nombre } = user;

        const code = Math.floor(generator.random() * 9000) + 1000;

        await prisma.recoveryPassword.create({
            data: {
                user: user.uid,
                code
            }
        });

        await resend.emails.send({
            from: "petClub <admin@petclub.com.pe>",
            to: `${email}`,
            reply_to: "contacto@petclub.com.pe",
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
                        <p>¡Gracias por ser parte de petClub, la comunidad de amantes de las mascotas!</p>
                        <p>NOVAMATRIX | Lima - Perú</p>
                    </div>
                </div>
            </body>
            </html>`,
        });
        res.status(201).json({
            msg: 'Código enviado'
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export {
    recoveryPasswordPostValidation,
    recoveryPasswordPost
};