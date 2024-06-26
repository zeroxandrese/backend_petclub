import { response, query } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_name,
    api_key: process.env.CLOUDINARY_apikey,
    api_secret: process.env.CLOUDINARY_apisecret,
    secure: true
  });
import NodeGeocoder from 'node-geocoder';

import { PrismaClient } from '@prisma/client';
import uploadFileValidation from '../helpers/upload-file';

const options: NodeGeocoder.Options = {
    provider: 'google',
    apiKey: process.env.key,
};

const prisma = new PrismaClient();

const geocoder = NodeGeocoder(options);

const petsGet = async (req: any, res = response) => {
    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = 10;

    try {
        const pets = await prisma.pet.findMany({
            where: {
                status: true
            },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        res.status(201).json(pets);
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const petsGetOneOfUser = async (req: any, res = response) => {
    const id = req.params.id;

    // Se busca al un id de mascota es especifico
    const pet = await prisma.pet.findFirst({ where: { uid: id } });
    res.status(201).json({ pet });
};

const petsGetAllOfUser = async (req: any, res = response) => {
    const id = req.params.id;

    // Se busca al un id de mascota es especifico
    const pet = await prisma.pet.findMany({
        where: { user: id }
    });
    res.status(201).json({ pet });
};

const petsPut = async (req: any, res = response) => {
    const id = req.params.id;
    const { ...pet } = req.body;
    const { perdido, lantitudeEvento, fechaEvento, longitudeEvento, horaEvento, nombre, sexo, tipo, edad, raza, descripcion } = req.body;

    try {
        const petPutValidation = await prisma.pet.findUnique({ where: { uid: id } });

        if (!petPutValidation) {
            return res.status(404).json({ msg: 'Pet not found.' });
        }

        if (petPutValidation && petPutValidation.perdido === false && perdido === true && longitudeEvento && lantitudeEvento && fechaEvento && horaEvento) {

            const lantitudePerdidaNumber = parseFloat(lantitudeEvento);
            const longitudePerdidaNumber = parseFloat(longitudeEvento);

            const resAddress = await geocoder.reverse({ lat: lantitudePerdidaNumber, lon: longitudePerdidaNumber });
            const dateLost = fechaEvento ? new Date(fechaEvento) : null;
            const dayLost = dateLost?.getDate();
            const monthNamesLost = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const monthIndexLost = dateLost?.getMonth() ?? null;
            const yearLost = dateLost?.getFullYear();
            const finalUserVisibleDate = (dayLost !== undefined && monthIndexLost !== null && yearLost !== undefined)
                ? `${dayLost} de ${monthNamesLost[monthIndexLost]} del ${yearLost}`
                : '';

            await prisma.image.create({
                data: {
                    user: petPutValidation.user,
                    pet: id,
                    img: petPutValidation.img,
                    descripcion: petPutValidation.descripcion,
                    actionPlan: "LOST",
                    fechaEvento: fechaEvento || new Date(),
                    horaEvento: horaEvento || '',
                    longitudeEvento: longitudeEvento || 0,
                    lantitudeEvento: lantitudeEvento || 0,
                    namePet: petPutValidation.nombre,
                    finalUserVisibleAddress: resAddress[0].formattedAddress,
                    finalUserVisibleDate: finalUserVisibleDate
                }
            })

            const mascota = await prisma.pet.update({ where: { uid: id }, data: { ...pet } });
            return res.status(201).json({ pet: mascota });

        }

        if (petPutValidation.perdido === true) {
            if (perdido === true) {
                return res.status(400).json({ msg: 'La mascota ya fue reportada.' });
            } else {
                const mascota = await prisma.pet.update({ where: { uid: id }, data: { ...pet } });
                const resp = await prisma.image.findFirst({
                    where: {
                        user: petPutValidation.user,
                        status: true, pet: id,
                        actionPlan: "LOST"
                    }
                });
                if (resp) {
                    await prisma.image.update({
                        where: { uid: resp.uid },
                        data: { status: false }
                    })
                }
                return res.status(201).json({ pet: mascota });
            }
        }

        if (nombre || sexo || tipo || edad || raza || descripcion) {
            const pets = await prisma.pet.update({ where: { uid: petPutValidation.uid }, data: { ...pet } });
            return res.status(201).json({ pet: pets });
        }

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({ msg: 'Algo salió mal, contacte con el administrador' });
    }
};

const petsPost = async (req: any, res = response) => {

    const uid = await req.userAuth;
    const { name, tempFilePath } = req.files.file;
    try {
        const nameValidation = await uploadFileValidation(name, undefined);

        if (nameValidation === false) {
            return res.status(400).json({
                msg: 'La extensión no está permitida',
            });
        }

        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        const pet = await prisma.pet.create({
            data: {
                user: uid._id,
                img: secure_url,
                nombre: req.body.data ? JSON.parse(req.body.data).nombre : '',
                sexo: req.body.data ? JSON.parse(req.body.data).sexo : '',
                tipo: req.body.data ? JSON.parse(req.body.data).tipo : '',
                edad: req.body.data ? JSON.parse(req.body.data).edad : '',
                descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
                raza: req.body.data ? JSON.parse(req.body.data).raza : ''
            }
        });

        const idResult = await prisma.pawsCount.findFirst({ where: { user: uid.uid } });

        if (!idResult) {
  
          await prisma.pawsCount.create({
            data: {
              user: uid.uid,
              paws: 5,
              lastUpdate: new Date()
            }
          });
  
        } else {
          if (idResult.paws !== null) {
            await prisma.pawsCount.update({
              where: { uid: idResult.uid }, data: { paws: idResult.paws + 5, lastUpdate: new Date() }
            });
          }
        }
  
        const idResultPoint = await prisma.tokenPoint.findFirst({
          where:
            { user: uid.uid }
        });
  
        if (!idResultPoint) {
          await prisma.tokenPoint.create({
            data: {
              user: uid.uid,
              points: 50,
              lastUpdate: new Date()
            }
          });
  
        } else {
          if (idResultPoint.points !== null) {
            await prisma.tokenPoint.update({ where: { uid: idResultPoint.uid }, data: { points: idResultPoint.points + 50, lastUpdate: new Date() } })
          }
        }
  
        res.status(201).json({
            pet
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Algo salio mal, contacte con el administrador'
        });
    }
};

const petsDelete = async (req: any, res = response) => {
    const id = req.params.id;
    //Borrar usuario permanentemente
    //const usuario = await User.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const pet = await prisma.pet.update({
        where: { uid: id }, data: { status: false }
    });

    res.status(201).json({ pet });
};

export {
    petsGet,
    petsPut,
    petsPost,
    petsDelete,
    petsGetOneOfUser,
    petsGetAllOfUser
}