import { Request, Response } from 'express'; // Import Express types
import { User } from '../models/index'; // Assuming User model import
import { Alerts } from '../models/index'; // Assuming Alerts model import

interface UserWithId {
  _id: string; // Type for user ID
}

const idValidatorAlert = async (req: Request, res: Response, next: Function) => {
  const uid: UserWithId | undefined = req.userAuth; // Type UserWithId or undefined

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
    const validacionIdAlert = await Alerts.findById(id);

    if (!validacionIdAlert) {
      return res.status(400).json({
        msg: 'ID no valido',
      });
    }

    if (uid._id !== validacionIdAlert.user.toString()) { // Use toString() for comparison
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

export { idValidatorAlert };
