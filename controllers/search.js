const { response, query } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Image, Pet } = require('../models/index');

const collectionPermitidas = [
    /*'emails',
    'pais',
    'roles',
    'sexos',*/
    'petsImg',
    'pets',
    'users',
    'images',
    'petsalluser'
]

const searchUsuarios = async (term = '', res = response) => {

    const mongoID = ObjectId.isValid(term);

    if (mongoID) {
        const user = await User.findById(term);
        return res.status(201).json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp(term, 'i');
    const user = await User.find({
        $or: [{ nombre: regex }, { email: regex }, { roles: regex }],
        $and: [{ status: true }]
    });

    res.status(201).json({
        results: user
    });
}

const searchPetsImg = async (term = '', res = response) => {

    const image = await Image.find({
        $or: [{ pet: term }],
        $and: [{ status: true }]
    });

    res.status(201).json({
        results: image
    });

};

const searchPetsAllUser = async (term = '', res = response) => {

    const pets = await Pet.find({
        $or: [{ user: term }],
        $and: [{ status: true }]
    });

    res.status(201).json({
        results: pets
    });

};

const searchPet = async (term = '', res = response) => {

    const mongoID = ObjectId.isValid(term);

    if (mongoID) {
        const pet = await Pet.findById(term);
        return res.status(201).json({
            results: (pet) ? [pet] : []
        });
    }

    const regex = new RegExp(term, 'i');
    const pet = await Pet.find({
        $or: [{ nombre: regex }, { tipo: regex }],
        $and: [{ status: true }]
    });

    res.status(201).json({
        results: user
    });
};

const searchImages = async (term = '', res = response) => {

    const image = await Image.find({
        $or: [{ user: term }],
        $and: [{ status: true }]
    });

    res.status(201).json({
        results: image
    });

}

const searchGet = async (req, res = response) => {

    const { collection, term } = req.params;

    if (!collectionPermitidas.includes(collection)) {
        return res.status(400).json({
            msg: 'La collection no existe'
        });
    }

    switch (collection) {
        /*          case 'emails':
        
                    break;*/
        case 'petsalluser':
            searchPetsAllUser(term, res);
            break;
        case 'pets':
            searchPet(term, res);
            break;
        case 'petsImg':
            searchPetsImg(term, res);
            break;
        case 'images':
            searchImages(term, res);
            break;
        case 'users':
            searchUsuarios(term, res);
            break;

        default:
            res.status(500).json({
                msg: 'Collection no incluida, Contacta al admin'
            });
    }
};

module.exports = {
    searchGet
}