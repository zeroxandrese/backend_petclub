import { response, request } from 'express';
import * as bcryptjs from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

import { generateJwt } from '../helpers/generate-jwt';

interface AuthenticatedRequest extends Request {
    userAuth?: {
        uid: string;
    }
}

const prisma = new PrismaClient();

const verifyToken = async (req: any, res = response) => {

    const uid = await req.userAuth;

    try {
        if (!uid) {
            return res.status(400).json({
                msg: 'El token no se ha validado'
            });
        }

        res.status(201).json({
            user: uid
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Algo salio mal, contacte con el administrador'
        })
    }
};


const login = async (req: any, res = response) => {

    const { email, password } = req.body;

    try {
        // Validacion correo 
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).json({
                msg: 'El email / Password son incorrectos'
            });
        }
        //Validacion usuario activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'El email / Password son incorrectos'
            });
        }
        //Validacion password
        if (!user.password) {
            return res.status(400).json({
                msg: 'El email / Password son incorrectos'
            });
        }

        const findPassword = await bcryptjs.compareSync(password, user!.password);
        if (!findPassword) {
            return res.status(400).json({
                msg: 'El email / Password son incorrectos'
            });
        }
        //Generar JWT
        const token = await generateJwt(user.uid);

        res.json({
            user,
            token
        });

    } catch (err) {
        res.status(500).json({
            msg: 'Algo salio mal, contacte con el administrador'
        })
    }
};

const googleLogin = async (req: any, res = response) => {
    const { googleToken } = req.body;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    try {
        // Verificar el token de Google usando la librería google-auth-library
        const client = new OAuth2Client(googleClientId);
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: googleClientId
        });

        const payload = await ticket.getPayload();

        if (!payload) {
            return res.status(500).json({
                msg: 'Error ponerse en contacto con el admin'
            });
        }

        const googleUserId = payload.sub;
        // Verificar si el usuario ya está registrado en tu base de datos
        let user = await prisma.user.findUnique({
            where: { email: payload.email }
        }
        );

        //Creacion del usuario si la informacion no existe
        if (!user) {
            const { email, name, picture } = payload;
            prisma.user.create({
                data: {
                    email: email || 'default@example.com',
                    nombre: name || 'Default Name',
                    img: picture,
                    google: true,
                    googleUserId,
                }
            })
        };

        const userId = user?.uid;
        //Generar JWT
        const token = await generateJwt(userId?.toString());

        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export {
    login,
    googleLogin,
    verifyToken
}