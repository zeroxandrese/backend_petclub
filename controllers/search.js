const { response, query } = require('express');
const { ObjectId } = require('mongoose').Types;
const {User, Image} = require('../models/index');

const collectionPermitidas = [
    /*'emails',
    'pais',
    'roles',
    'sexos',
    'tipos',*/
    'users',
    'images'
]

const searchUsuarios = async (term = '', res = response) => {

    const mongoID = ObjectId.isValid(term);

    if (mongoID) {
        const user = await User.findById(term);
        return res.status(201).json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp( term, 'i' );
    const user = await User.find({ 
        $or: [{ nombre: regex }, { email: regex }, { tipo: regex }, { roles: regex }],
        $and: [{ status: true }]
     });

    res.status(201).json({
        results: user
    });
}

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
/*         case 'emails':

            break;
        case 'pais':

            break;
        case 'roles':

            break;
        case 'sexos':

            break;*/
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