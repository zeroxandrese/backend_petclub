const { response, query } = require('express');

const { Pet } = require('../models/index');


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
    const pets = await Pet.findOne({id});
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

    const { nombre, sexo, tipo, edad } = req.body;

    const data = {
        user: uid._id,
        nombre,
        sexo,
        tipo,
        edad
    };

    const pet = new Pet(data);

    await pet.save();

    res.status(201).json({
        pet
    });
};

const petsDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar usuario permanentemente
    //const usuario = await User.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const mascota = await Pet.findByIdAndUpdate( id, { status: false });

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