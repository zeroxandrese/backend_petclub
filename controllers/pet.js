const { response, query } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { Pet } = require('../models/index');
const { uploadFileValidation } = require('../helpers/upload-file');


const petsGet = async (req, res = response) => {
    const { page } = req.query;
    const options = { page: page || 1, limit: 10 }
    const query = { status: true };

    // se estan enviando dos promesas al mismo tiempo para calcular el paginado de transacciones
    const pets = await Pet.paginate(query, options)
    res.status(201).json(pets);
};

const petsGetOneOfUser = async (req, res = response) => {
    const id = req.params.id;

    // Se busca al un id de mascota es especifico
    const pet = await Pet.findById(id);
    res.status(201).json(pet);
};

const petsGetAllOfUser = async (req, res = response) => {
    const id = req.params.id;

    // Se busca al un id de mascota es especifico
    const pets = await Pet.find({ id });
    res.status(201).json(pets);
};

const petsPut = async (req, res = response) => {
    const id = req.params.id;
    const { ...pet } = req.body;

    const mascota = await Pet.findByIdAndUpdate(id, pet);

    res.status(201).json(mascota);
};

const petsPost = async (req, res = response) => {

    const uid = await req.userAuth;
    const { name, tempFilePath } = req.files.file;
    try {
        const nameValidation = await uploadFileValidation(name, undefined);

        if (nameValidation === false) {
            return res.status(400).json({
                msg: 'La extensión no está permitida',
            });
        }

        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        console.log(req.body.data);

        const data = {
            user: uid._id,
            img: secure_url,
            nombre: req.body.data ? JSON.parse(req.body.data).nombre : '',
            sexo: req.body.data ? JSON.parse(req.body.data).sexo : '',
            tipo: req.body.data ? JSON.parse(req.body.data).tipo : '',
            edad: req.body.data ? JSON.parse(req.body.data).edad : '',
            descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
            raza: req.body.data ? JSON.parse(req.body.data).raza : ''
        };

        const pet = new Pet(data);

        await pet.save();

        res.status(201).json({
            pet
        });

    } catch (error) {
        console.log(error);
    }
};

const petsDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar usuario permanentemente
    //const usuario = await User.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const mascota = await Pet.findByIdAndUpdate(id, { status: false });

    res.status(201).json({ mascota });
};

module.exports = {
    petsGet,
    petsPut,
    petsPost,
    petsDelete,
    petsGetOneOfUser,
    petsGetAllOfUser
}