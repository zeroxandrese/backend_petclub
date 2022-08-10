const { response } = require('express');

const usersGet = (req, res = response) => {
    const { id, nombre, apellido, status, perfil } = req.query;

    res.json({
        msg: 'get API',
        id,
        nombre,
        apellido,
        status,
        perfil
    })
};

const usersPut = (req, res = response) => {
    const id = req.params.id

    res.json({
        msg: 'put API',
        id
    })
};

const usersPost = (req, res = response) => {
    const body = req.body

    res.json({
        msg: 'post API',
        body
    })
};

const usersDelete = (req, res = response) => {
    res.json({
        msg: 'delete API'
    })
};

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}