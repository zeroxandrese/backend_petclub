import { response, query } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reportPost = async (req: any, res = response) => {

    const uid = await req.userAuth;
    const { note } = req.body;
    const id = req.params.id;
    if (!note) {
        return res.status(401).json({
            msg: 'Necesita enviar una interacción'
        })
    }

    try {

        await prisma.report.create({
            data: {
                user: uid.uid,
                userReported: id,
                note
            }
        });    

        res.status(201).json({
            msg: 'Reporte enviado de manera satisfactoria'
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const reportDelete = async (req: any, res = response) => {
    const id = req.params.id;
    //Borrar report permanentemente
    //const report = await Report.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const report = await prisma.report.update({ where:{ uid: id }, data: { status: false } });

    res.status(201).json({ report });
};

export {
    reportPost,
    reportDelete
}