const { response, query } = require('express');

const { Notifications } = require('../models/index');

const notificationsPut = async (req, res = response) => {

    const id = req.params.id;

    const notification = await Notifications.findByIdAndUpdate(id, { statusSeen: true });

    res.status(201).json(notification);
};

module.exports = {
    notificationsPut
}