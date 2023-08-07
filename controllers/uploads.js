const { response } = require('express');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFileValidation } = require('../helpers/upload-file');
const { User, Image, Pet } = require('../models/index');
const noImagePath = path.join(__dirname, '../assets/', 'no-image.jpg');

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

const cloudinaryUploadFile = async (req, res = response) => {
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
        case 'pets':
            modelo = await Pet.findById(id)
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
    if (modelo.img) {
        console.log('consiguio imagen');
        const nameArr = modelo.img.split('/');
        const name = nameArr[nameArr.length - 1];
        const [public_id] = name.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { name, tempFilePath } = req.files.file;
    try {
        const nameValitation = await uploadFileValidation(name, undefined);
        if (nameValitation === false) {
            return res.status(401).json({
                msg: 'La extensión no esta permitida'
            });
        }
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;

        await modelo.save();

        res.json(modelo)
    } catch (error) {
        console.log(error)

    }
}

const getUpload = async (req, res = response) => {
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
        case 'pets':
            modelo = await Pet.findById(id)
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
    // validacion existe img
    if (modelo.img) {
        return res.json(modelo);
    }

    res.sendFile(noImagePath)
}

module.exports = {
    /* uploadsFiles, */
    cloudinaryUploadFile,
    getUpload
}