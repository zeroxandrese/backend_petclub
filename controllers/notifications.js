const { response, query } = require('express');

const { Notifications } = require('../models/index');

const notificationsPut = async (req, res = response) => {

    const id = req.params.id;
    if (!id) {
        return res.status(401).json({
            msg: 'Datos incompletos'
        })
    }
    const notification = await Notifications.findByIdAndUpdate(id, { statusSeen: true });

    res.status(201).json(notification);
};

module.exports = {
    notificationsPut
}