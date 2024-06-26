import type { Request, Response } from 'express';

const verifyUploadFile = (req: Request, res: Response, next: () => void) => {
    // Verificar si hay archivos en la solicitud
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'No files were uploaded.'
        });
    }

    if (!req.files.file) {
        return res.status(400).json({
            msg: 'No existe el archivo "file" para cargar.'
        });
    }

    next();
};

export default verifyUploadFile;