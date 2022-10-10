const { response, query } = require('express');
const bcryptjs = require('bcryptjs');

const { User } = require('../models/index');


const usersGet = async (req, res = response) => {
    //const { id, nombre, apellido } = req.query;.
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

     // se estan enviando dos promesas al mismo tiempo para calcular el paginado de usuarios
    const [ total, users ] = await Promise.all([
        User.count(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(201).json({
        total,
        users
    })
};

const usersPut = async (req, res = response) => {
    const id = req.params.id;
    const { password, google, correo, ...user } = req.body;

    //Validacion clave contra la base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await User.findByIdAndUpdate(id, user);

    res.status(201).json(usuario);
};

const usersPost = async (req, res = response) => {

    const { nombre, sexo, tipo, password, email, pais, edad, role, status, google } = req.body;
    const user = new User({ nombre, sexo, tipo, password, email, pais, edad, role, status, google });

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