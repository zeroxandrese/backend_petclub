import { response, query } from 'express';
import * as bcryptjs from 'bcryptjs';

import { PrismaClient } from '@prisma/client';
import { generateJwt } from '../helpers/generate-jwt';

const prisma = new PrismaClient();

const usersGet = async (req: any, res = response) => {

    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = 20;

    try {

        // Obtencion total usuarios
        const totalDocs = await prisma.user.count({
            where: { status: true },
        });

        // calculo total paginas
        const totalPages = Math.ceil(totalDocs / pageSize);

        const docs = await prisma.user.findMany({
            where: { status: true },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        // calculos para la paginacion
        const pagingCounter = (pageNumber - 1) * pageSize + 1;
        const hasPrevPage = pageNumber > 1;
        const hasNextPage = pageNumber < totalPages;
        const prevPage = hasPrevPage ? pageNumber - 1 : null;
        const nextPage = hasNextPage ? pageNumber + 1 : null;

        res.status(201).json({
            docs,
            totalDocs,
            limit: pageSize,
            totalPages,
            page: pageNumber,
            pagingCounter,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const usersPut = async (req: any, res = response) => {
    const uid = req.params.id;
    const { password, google, correo, ...user } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
    }

    try {
        const usuario = await prisma.user.update({
            where: { uid },
            data: { ...user },
        });

        res.status(201).json(usuario);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
};

const usersPost = async (req: any, res = response) => {
    const { nombre, sexo, password, email, latitude, longitude, edad, role, status, google } = req.body;

    try {
        // Encriptado del password
        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        let formattedEdad: Date | undefined = undefined;
        if (edad) {
            formattedEdad = new Date(edad);
            if (isNaN(formattedEdad.getTime())) {
                return res.status(400).json({ msg: 'Formato de fecha inválido' });
            }
        }

        // Crear usuario con Prisma
        const newUser = await prisma.user.create({
            data: {
                nombre,
                sexo,
                password: hashedPassword,
                email,
                latitude,
                longitude,
                edad: formattedEdad,
                role,
                status,
                google,
            }
        });

        // Generar JWT
        const token = await generateJwt(newUser.uid);

        res.status(201).json({
            user: newUser,
            token
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ msg: 'Error al crear usuario' });
    }
};

const usersDelete = async (req: any, res = response) => {
    const id = req.params.id;

    try {
        // Actualizar el usuario con status: false para marcarlo como eliminado
        const usuario = await prisma.user.update({
            where: { uid: id },
            data: { status: false }
        });

        res.status(201).json({ usuario });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
};

export {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}