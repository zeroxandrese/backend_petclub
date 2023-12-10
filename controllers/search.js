const { response, query } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Image, Pet, Notifications } = require('../models/index');

const collectionPermitidas = [
    'emails',
    'pais',
    'roles',
    'sexos',
    'petsImg',
    'pets',
    'users',
    'images',
    'petsalluser',
    'imagesLost',
    'notifications',
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

const searchEmailUser = async (term = '', res = response) => {

    const user = await User.findOne({
        $or: [{ email: term }],
        $and: [{ status: true }]
    });

    res.status(201).json({
        results: user
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
        results: pet
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

};

const searchNotifications = async (term = '', res = response) => {

    const notification = await Notifications.find({
        $or: [{ userSender: term }],
        $and: [{ status: true }]
    });

    res.status(201).json({
        results: notification
    });

};

const searchImagesLost = async (latPunto, lonPunto, res = response) => {
    const query = {
        $and: [
            { status: true },
            { actionPlan: 'LOST' }
        ]
    };

    const images = await Image.find(query);

    // Verifica si se proporcionaron las coordenadas del punto de referencia
    if (latPunto && lonPunto) {
        // Filtra las imágenes por distancia usando las coordenadas proporcionadas
        const radioKm = 2; // variable de KM a la redonda
        const imagesFiltradas = images.filter(image => {
            const distancia = calcularDistancia(latPunto, lonPunto, image.lantitudeEvento, image.longitudeEvento);
            return distancia <= radioKm;
        });

        images = imagesFiltradas;
    }

    res.status(201).json({
        images
    });
};

const searchGet = async (req, res = response) => {

    const { collection, latPunto, lonPunto, term } = req.params;

    if (!collectionPermitidas.includes(collection)) {
        return res.status(400).json({
            msg: 'La collection no existe'
        });
    }

    switch (collection) {
        case 'emails':
            searchEmailUser(term, res)
            break;
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
        case 'imagesLost':
            searchImagesLost(latPunto, lonPunto, res);
            break;
        case 'notifications':
            searchNotifications(term, res);
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