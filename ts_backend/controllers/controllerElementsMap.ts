import { response, query } from 'express';
import { PrismaClient } from '@prisma/client';

interface AuthenticatedRequest extends Request {
    userAuth?: {
        uid: string;
    }
}

const prisma = new PrismaClient();

const searchImagesLostGet = async (req: any, res = response) => {

    const { latPunto, lonPunto } = req.body;

    try {
        // Convertir las coordenadas a números
        const latitude = latPunto ? parseFloat(latPunto as string) : null;
        const longitude = lonPunto ? parseFloat(lonPunto as string) : null;

        // Validar que las coordenadas sean números válidos
        const isValidLatitude = latitude !== null && !isNaN(latitude);
        const isValidLongitude = longitude !== null && !isNaN(longitude);

        let query: any = {
            where: {
                status: true,
                actionPlan: 'LOST',
            },
        };

        // Calcular los kilómetros a la redonda si las coordenadas son válidas
        if (isValidLatitude && isValidLongitude) {
            const radioKm = 3;
            query.where.AND = [
                {
                    lantitudeEvento: {
                        gte: latitude - (1 / 111) * radioKm,
                        lte: latitude + (1 / 111) * radioKm,
                    },
                },
                {
                    longitudeEvento: {
                        gte: longitude - (1 / (111 * Math.cos(latitude * (Math.PI / 180)))) * radioKm,
                        lte: longitude + (1 / (111 * Math.cos(latitude * (Math.PI / 180)))) * radioKm,
                    },
                },
            ];
        }

        const images = await prisma.image.findMany(query);


        res.status(201).json({
            images
        });
    } catch (error) {
        console.error('Error while searching for lost images:', error);
        res.status(500).json({
            msg: 'Algo salió mal, contacte con el administrador'
        });
    }
};

const searchRefugiosGet = async (req: any, res = response) => {

    const { latPunto, lonPunto } = req.body;

    try {
        // Convertir las coordenadas a números
        const latitude = latPunto ? parseFloat(latPunto as string) : null;
        const longitude = lonPunto ? parseFloat(lonPunto as string) : null;

        // Validar que las coordenadas sean números válidos
        const isValidLatitude = latitude !== null && !isNaN(latitude);
        const isValidLongitude = longitude !== null && !isNaN(longitude);

        let query: any = {
            where: {
                status: true
            },
        };

        // Calcular los kilómetros a la redonda si las coordenadas son válidas
        if (isValidLatitude && isValidLongitude) {
            const radioKm = 3;
            query.where.AND = [
                {
                    latitude: {
                        gte: latitude - (1 / 111) * radioKm,
                        lte: latitude + (1 / 111) * radioKm,
                    },
                },
                {
                    longitude: {
                        gte: longitude - (1 / (111 * Math.cos(latitude * (Math.PI / 180)))) * radioKm,
                        lte: longitude + (1 / (111 * Math.cos(latitude * (Math.PI / 180)))) * radioKm,
                    },
                },
            ];
        }

        const refugios = await prisma.elementMapRefugios.findMany(query);

        res.status(201).json({
            refugios
        });

    } catch (error) {
        console.error('Error while searching for refugios:', error);
        res.status(500).json({
            msg: 'Algo salió mal, contacte con el administrador'
        });
    }
};

export {
    searchImagesLostGet,
    searchRefugiosGet
}