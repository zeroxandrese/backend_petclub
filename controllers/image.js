const { response, query } = require('express');

const { Image } = require('../models/index');

const imagesGet = async (req, res = response) => {
    //const { id, nombre, apellido } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

     // se estan enviando dos promesas al mismo tiempo para calcular el paginado de usuarios
    const [ total, imagenes ] = await Promise.all([
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
    const { status, ...image } = req.body;

    const imagen = await Image.findByIdAndUpdate(id, image);

    res.status(201).json(imagen);
};

const imagesPost = async (req, res = response) => {

    const uid = await req.userAuth;

    const { img, descripcion } = req.body;
    const data = {
        user: uid._id,
        img,
        descripcion
    }

    const image = new Image(data);

    await image.save();

    res.status(201).json(image);
};

const imagesDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar imagen permanentemente
    //const img = await Image.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const img = await Image.findByIdAndUpdate( id, { status: false });

    res.status(201).json({ img });
};

module.exports = {
    imagesGet,
    imagesPut,
    imagesPost,
    imagesDelete
}