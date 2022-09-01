const { response, query } = require('express');
const { ObjectId } = require('mongoose').Types;
const User = require('../models/user')

const collectionPermitidas = [
    /*'emails',
    'pais',
    'roles',
    'sexos',
    'tipos',*/
    'users'
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

            break;
        case 'tipos':

            break; */
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