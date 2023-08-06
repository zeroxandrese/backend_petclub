const { response, query } = require('express');
const bcryptjs = require('bcryptjs');
const { generateJwt } = require('../helpers/generate-jwt');

const { User } = require('../models/index');


const usersGet = async (req, res = response) => {
    const { page } = req.query;
    const options = { page: page || 1, limit: 10 }
    const query = { status: true };

    // se utliza paginate para traer todos los usuarios controlados
    const users = await User.paginate(query, options)
    res.status(201).json(users);
};

const usersPut = async (req, res = response) => {
    const uid1 = await req.userAuth._id;
    const uid2 = req.params.id;
    const { password, google, correo, ...user } = req.body;

    //Validacion clave contra la base de datos
    if (uid2 !== uid1) {
        return res.status(400).json({
            msg: 'La modificación no corresponde'
        })
    }

    if (password) {
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await User.findByIdAndUpdate(uid1, user);

    res.status(201).json(usuario);
};

const usersPost = async (req, res = response) => {

    const { nombre, sexo, password, email, latitude, longitude, edad, role, status, google } = req.body;
    const user = new User({ nombre, sexo, password, email, latitude, longitude, edad, role, status, google });

    //Encriptado del password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    const userCreated = await User.findOne({ email });

    //Generar JWT
    const token = await generateJwt( userCreated.id );

    res.status(201).json({
        user,
        token
    });
};

const usersDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar usuario permanentemente
    //const usuario = await User.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const usuario = await User.findByIdAndUpdate( id, { status: false });

    res.status(201).json({ usuario });
};

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}