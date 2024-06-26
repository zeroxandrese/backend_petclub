import jwt from 'jsonwebtoken';
import { response } from 'express';
import { PrismaClient } from '@prisma/client';

interface JwtPayload {
  uid: string; // Type for the payload data
}

interface User {
  uid: string;
  nombre: string;
  sexo?: string;
  password?: string | null;
  email: string;
  latitude?: number | null;
  longitude?: number | null;
  edad?: Date | null;
  role: string;
  status: boolean;
  google?: boolean;
  descripcion?: string | null;
  img?: string;
  logoPerfil?: string;
  created: Date;
  googleUserId?: string | null;
}

const prisma = new PrismaClient();

const generateJwt = async (uid = ''): Promise<string | null> => {
  try {
    const payload: JwtPayload = { uid };
    if (!process.env.SECRETORPRIVATEKEY) {
      throw new Error('No se encontró SECRETORPRIVATEKEY en el archivo .env');
    }

    const token = jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn: '7d',
    });
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    return null;
  }
};

const verifyToken = async (token = ''): Promise<any | null> => {
  try {
    if (token.length < 10) {
      return null;
    }

    if (!process.env.SECRETORPRIVATEKEY) {
      throw new Error('No se encontró SECRETORPRIVATEKEY en el archivo .env');
    }
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as JwtPayload;
    const usuario = await prisma.user.findUnique({ where:{ uid: decoded.uid }});

    return usuario
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
};

export { generateJwt, verifyToken };
