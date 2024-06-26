import { response, query, request } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const notificationsPut = async (req: any, res = response) => {

    const id = req.params.id;
    if (!id) {
        return res.status(401).json({
            msg: 'Datos incompletos'
        });
    }
    const notification = await prisma.notifications.update({ where: { uid: id }, data: { statusSeen: true } });

    res.status(201).json(notification);
};


export default notificationsPut;