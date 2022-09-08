const { response, query } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { Image } = require('../models/index');
const { uploadFileValidation } = require('../helpers/upload-file');

const imagesGet = async (req, res = response) => {
    //const { id, nombre, apellido } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    // se estan enviando dos promesas al mismo tiempo para calcular el paginado de imagenes
    const [total, imagenes] = await Promise.all([
        Image.count(query),
        Image.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(201).json({
        total,
        imagenes
    })
};

const imagesPut = async (req, res = response) => {
    
    const id = req.params.id;
    const { status, img, ...image } = req.body;

    const imagen = await Image.findByIdAndUpdate(id, image);

    res.status(201).json(imagen);
};



const imagesPost = async (req, res = response) => {

    const uid = await req.userAuth;
    const { name, tempFilePath } = req.files.file;
    try {
        const nameValitation = await uploadFileValidation(name, undefined);
    if (nameValitation === false) {
        return res.status(400).json({
            msg:'La extensión no esta permitida'
        })
    }
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        const { descripcion } = req.body;
        const data = {
            user: uid._id,
            img: secure_url,
            descripcion
        }

        const image = new Image(data);

        await image.save();

        res.status(201).json(image);
    } catch (error) {
        console.log(error)
    }
    
};

const imagesDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar imagen permanentemente
    //const img = await Image.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const img = await Image.findByIdAndUpdate(id, { status: false });

    res.status(201).json({ img });
};

module.exports = {
    imagesGet,
    imagesPut,
    imagesPost,
    imagesDelete
}