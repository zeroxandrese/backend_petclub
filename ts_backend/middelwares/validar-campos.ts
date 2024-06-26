import { response, request  } from 'express';
import type { NextFunction, Request } from 'express';
import { validationResult } from 'express-validator';

const validarCampos = (req=request, res=response, next: NextFunction) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json(erros);
    }
    next();
};

export default validarCampos;