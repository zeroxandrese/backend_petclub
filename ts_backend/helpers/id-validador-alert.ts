import { response, request  } from 'express';
import type { NextFunction, Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const idValidatorAlert = async (req= request, res= response, next: NextFunction) => {
  const uid = req.userAuth;

  if (!uid) {
    return res.status(500).json({
      msg: 'Se intenta validar el id sin validar token',
    });
  }

  const id = req.params.id;

  if (!id || id.trim() === '') {
    return res.status(400).json({
      msg: 'ID no valido',
    });
  }

  try {
    const validacionIdAlert = await prisma.alerts.findUnique({ where: { uid: id } });

    if (!validacionIdAlert) {
      return res.status(400).json({
        msg: 'ID no valido',
      });
    }

    if (uid.uid !== validacionIdAlert.user.toString()) { // Use toString() for comparison
      return res.status(401).json({
        msg: 'El uid no corresponde tiene alertas en esta foto',
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      msg: 'El uid no corresponde',
    });
  }
};

export default idValidatorAlert;