import { response, request  } from 'express';
import type { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';

interface JwtPayload {
    uid: string; // Type for the payload data
  }

  declare module 'express-serve-static-core' {
    interface Request {
      userAuth?: User | null;
    }
  }

const prisma = new PrismaClient();

const validarJWT = async (req: Request, res = response, next: NextFunction) => {

    const token = req.header('z-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición- token'
        })
    }

    try {

        if (!process.env.SECRETORPRIVATEKEY) {
            throw new Error('No se encontró SECRETORPRIVATEKEY en el archivo .env');
        }
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as JwtPayload;

        // validacion usuario autenticado
        const userAuth = await prisma.user.findUnique({ where: { uid: decoded.uid } });

        //Validacion del usuario exite
        if (!userAuth) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }

        //validacion de que el status este en true para su delete
        if (!userAuth || !userAuth.status) {
            return res.status(401).json({
              msg: 'Token no válido - usuario no encontrado o inactivo'
            });
          }

        req.userAuth = userAuth;

        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'No hay token en la petición - error'
        });
    }

}

export default validarJWT;