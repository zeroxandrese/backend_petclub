const { response } = require('express');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);

const { uploadFileValidation } = require('../helpers/upload-file');
const { User, Image } = require('../models');
const noImagePath = path.join(__dirname, '../assets/', 'no-image.jpg');

const uploadsFiles = async (req, res = response) => {

    const name = await uploadFileValidation(req.files.file,  undefined, collection);
    res.status(400).json({
        name
    })
};

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

const cloudinaryUpdateFile = async (req, res = response) => {

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
        const nameArr = modelo.img.split('/');
        const name = nameArr[nameArr.length-1];
        const [public_id] = name.split('.');
        console.log(public_id)
        cloudinary.uploader.destroy(public_id);
}

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo)
}

const getUpload = async (req, res = response) =>{
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
             return res.sendFile(imgPath)
        }
    }

    res.sendFile(noImagePath)
}

module.exports = {
    uploadsFiles,
    cloudinaryUpdateFile,
    getUpload
}