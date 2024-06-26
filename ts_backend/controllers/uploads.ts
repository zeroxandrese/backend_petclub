import { response, query } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_name,
    api_key: process.env.CLOUDINARY_apikey,
    api_secret: process.env.CLOUDINARY_apisecret,
    secure: true
  });

import uploadFileValidation from '../helpers/upload-file';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// funcion para carga de imaganes de prueba no utilizar!!
/* const uploadsFiles = async (req, res = response) => {

    const name = await uploadFileValidation(req.files.file,  undefined, collection);
    res.status(400).json({
        name
    })
}; */

// funcion para carga de imagenes de manera interna en el servidor no utilizar!!
/* const updateFile = async (req, res = response) => {

    const { id, collection } = req.params;

    let modelo;

    switch (collection) {
        case 'users':
            modelo = await User.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: 'El uuid no existe'
                });
            }
            break;
        case 'images':
            modelo = await Image.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: 'El uuid no existe'
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Coleccion no incluida, comunicate con el admin'
            });
    }

    // limpieza de archivos anteriores
    if(modelo.img){
    const imgPath = path.join(__dirname, '../uploads/', collection, modelo.img);
    if (fs.existsSync( imgPath )) {
        fs.unlinkSync( imgPath );
    }
}

    const name = await uploadFileValidation(req.files, undefined, collection);
    modelo.img = name;

    await modelo.save();

    res.json(modelo)
} */

const cloudinaryUploadFile = async (req: any, res = response) => {
    const uid = await req.userAuth;
    const { id, collection } = req.params;

    let modelo;

    if (id === 'undefined' || id === undefined || '') {
        return res.status(400).json({
            msg: 'ID no válido'
        });
    }

    const uidUpdate = String(uid.uid);

    try {
        switch (collection) {
            case 'users':
                modelo = await prisma.user.findUnique({
                    where: { uid: id }
                });
                if (!modelo) {
                    return res.status(400).json({
                        msg: 'El UUID no existe'
                    });
                }
                if (modelo.uid !== uidUpdate) {
                    return res.status(401).json({
                        msg: 'El UID no corresponde'
                    });
                }
                break;
            case 'images':
                modelo = await prisma.image.findUnique({
                    where: { uid: id }
                });
                if (!modelo) {
                    return res.status(400).json({
                        msg: 'El UUID no existe'
                    });
                }
                break;
            case 'pets':
                modelo = await prisma.pet.findUnique({
                    where: { uid: id }
                });
                if (!modelo) {
                    return res.status(400).json({
                        msg: 'El UUID no existe'
                    });
                }
                if (modelo.user !== uidUpdate) {
                    return res.status(401).json({
                        msg: 'El UID no corresponde'
                    });
                }
                break;
            default:
                return res.status(500).json({
                    msg: 'Colección no incluida, comunícate con el administrador'
                });
        }

        // Limpieza de archivos anteriores en Cloudinary
        if (modelo.img) {
            const publicId = modelo.img.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Subida del nuevo archivo a Cloudinary
        const { name, tempFilePath } = req.files.file;
        const nameValidation = await uploadFileValidation(name, undefined);
        if (!nameValidation) {
            return res.status(401).json({
                msg: 'La extensión no está permitida'
            });
        }
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;

        // Actualización del modelo en la base de datos
        switch (collection) {
            case 'users':
                await prisma.user.update({
                    where: { uid: id },
                    data: { img: secure_url }
                });
                break;
            case 'images':
                await prisma.image.update({
                    where: { uid: id },
                    data: { img: secure_url }
                });
                break;
            case 'pets':
                await prisma.pet.update({
                    where: { uid: id },
                    data: { img: secure_url }
                });
                break;
            default:
                break;
        }

        res.json(modelo);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ msg: 'Error al procesar la solicitud' });
    }
};

const getUpload = async (req: any, res = response) => {
    const { id, collection } = req.params;

    let modelo;

    try {
        switch (collection) {
            case 'users':
                modelo = await prisma.user.findUnique({
                    where: { uid: id }
                });
                break;
            case 'images':
                modelo = await prisma.image.findUnique({
                    where: { uid: id }
                });
                break;
            case 'pets':
                modelo = await prisma.pet.findUnique({
                    where: { uid: id }
                });
                break;
            default:
                return res.status(500).json({
                    msg: 'Colección no incluida, comunícate con el administrador'
                });
        }

        if (!modelo) {
            return res.status(400).json({
                msg: 'El UUID no existe'
            });
        }

        res.json(modelo);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ msg: 'Error al procesar la solicitud' });
    }
};

export {
    cloudinaryUploadFile,
    getUpload
}