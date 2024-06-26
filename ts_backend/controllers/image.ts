import { response, query, request } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_name,
  api_key: process.env.CLOUDINARY_apikey,
  api_secret: process.env.CLOUDINARY_apisecret,
  secure: true
});
import * as fs from 'fs';

import { PrismaClient } from '@prisma/client';
import uploadFileValidation from '../helpers/upload-file';

const prisma = new PrismaClient();

type Image = {
  uid: string;
  user: string;
  pet: string | null;
  img: string | null;
  status: boolean;
  descripcion: string | null;
  charged: Date;
  actionPlan: string;
  fechaEvento: Date | null;
  finalUserVisibleDate: string | null;
};

const shuffle = (array: Image[]): Image[] => {
  let currentIndex = array.length, randomIndex, temporaryValue;

  // Mientras haya elementos para mezclar
  while (currentIndex !== 0) {
    // Selecciona un elemento restante
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Intercambia el elemento seleccionado con el actual
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const imagesGet = async (req= request, res = response) => {

  const { page } = req.query;
  const pageNumber = parseInt(page as string, 10) || 1;
  const pageSize = 20;

  try {

    // Obtencion total imagenes
    const totalDocs = await prisma.image.count({
      where: { status: true },
    });

    // calculo total paginas
    const totalPages = Math.ceil(totalDocs / pageSize);

    const docs: Image[] = await prisma.image.findMany({
      where: { status: true },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    // Mezclar las imágenes obtenidas
    const shuffledImages = shuffle(docs);

    // calculos para la paginacion
    const pagingCounter = (pageNumber - 1) * pageSize + 1;
    const hasPrevPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;
    const prevPage = hasPrevPage ? pageNumber - 1 : null;
    const nextPage = hasNextPage ? pageNumber + 1 : null;

    // Reemplazar las imágenes mezcladas en la respuesta
    const images = shuffledImages;
    
    res.status(201).json({
      docs: images,
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
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const imagesPut = async (req: any, res = response) => {

  const id = req.params.id;
  const { status, img, ...image } = req.body;
  try {
    const imagen = await prisma.image.update({ where: { uid: id }, data: { ...image } });

    res.status(201).json(imagen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const imagesPost = async (req: any, res = response) => {
  let secure_url2 = '';
  const uid = await req.userAuth;
  const { name, tempFilePath } = req.files.file;

  try {
    const nameValidation = await uploadFileValidation(name, undefined);

    if (nameValidation === false) {
      return res.status(400).json({
        msg: 'La extensión no está permitida',
      });
    }

    const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;

    const commonTransformation = [
      { quality: "auto" },
    ];

    const commonTransformationLitt = [
      {
        format: 'jpg',
        transformation: [
          { width: 104, height: 104, crop: 'scale' },
        ]
      }
    ];

    function getFileSize(filePath: string) {
      const stats = fs.statSync(filePath);
      return stats.size;
    }

    // Validación Video
    if (nameValidation === 'mp4' || nameValidation === 'mov') {
      const videoSize = getFileSize(tempFilePath);


      if (videoSize > MAX_VIDEO_SIZE_BYTES) {
        return res.status(400).json({
          msg: 'El video es demasiado grande',
        });
      }

      // Subir video a Cloudinary con transformaciones
      const videoUploadResult = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: 'video',
        chunk_size: 6000000,
        eager: commonTransformationLitt
      });

      const image = await prisma.image.create({
        data: {
          user: uid.uid,
          img: videoUploadResult.secure_url,
          descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
          actionPlan: "IMAGE",
        }
      });

      const idResult = await prisma.pawsCount.findFirst({ where: { user: uid.uid } });

      if (!idResult) {

        await prisma.pawsCount.create({
          data: {
            user: uid.uid,
            paws: 2,
            lastUpdate: new Date()
          }
        });

      } else {
        if (idResult.paws !== null) {
          await prisma.pawsCount.update({
            where: { uid: idResult.uid }, data: { paws: idResult.paws + 2, lastUpdate: new Date() }
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
            points: 25,
            lastUpdate: new Date()
          }
        });

      } else {
        if (idResultPoint.points !== null) {
          await prisma.tokenPoint.update({ where: { uid: idResultPoint.uid }, data: { points: idResultPoint.points + 25, lastUpdate: new Date() } })
        }
      }

      const idResultCountVideos = await prisma.countVideos.findFirst({
        where:
          { user: uid.uid }
      });

      if (!idResultCountVideos) {
          await prisma.countVideos.create({
              data: {
                  user: uid.uid,
                  videos: 1,
                  lastUpdate: new Date()
              }
          });
      }else {
        if (idResultCountVideos.videos !== null) {
          await prisma.countVideos.update({ where: { uid: idResultCountVideos.uid }, data: { videos: idResultCountVideos.videos + 1, lastUpdate: new Date() } })
        }
      }

      res.status(201).json(image);
    } else {

      // Subir imagen a Cloudinary con transformaciones
      const imageUploadResult = await cloudinary.uploader.upload(tempFilePath);

      const image = await prisma.image.create({
        data: {
          user: uid.uid,
          img: imageUploadResult.secure_url,
          descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
          actionPlan: "IMAGE"
        }
      })

      const idResult = await prisma.pawsCount.findFirst({ where: { user: uid.uid } });

      if (!idResult) {

        await prisma.pawsCount.create({
          data: {
            user: uid.uid,
            paws: 1,
            lastUpdate: new Date()
          }
        });

      } else {
        if (idResult.paws !== null) {
          await prisma.pawsCount.update({
            where: { uid: idResult.uid }, data: { paws: idResult.paws + 1, lastUpdate: new Date() }
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
            points: 10,
            lastUpdate: new Date()
          }
        });

      } else {
        if (idResultPoint.points !== null) {
          await prisma.tokenPoint.update({ where: { uid: idResultPoint.uid }, data: { points: idResultPoint.points + 10, lastUpdate: new Date() } })
        }
      }

      const idResultCountImages = await prisma.countImage.findFirst({
        where:
          { user: uid.uid }
      });

      if (!idResultCountImages) {
          await prisma.countImage.create({
              data: {
                  user: uid.uid,
                  images: 1,
                  lastUpdate: new Date()
              }
          });
      }else {
        if (idResultCountImages.images !== null) {
          await prisma.countImage.update({ where: { uid: idResultCountImages.uid }, data: { images: idResultCountImages.images + 1, lastUpdate: new Date() } })
        }
      }

      res.status(201).json(image);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error contacte al admin' });
  }
};

const imagesDelete = async (req: any, res = response) => {
  const id = req.params.id;
  //Borrar imagen permanentemente
  //const img = await Image.findByIdAndDelete( id );

  //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
  const img = await prisma.image.update({ where: { uid: id }, data: { status: false } });

  res.status(201).json({ img });
};

export {
  imagesGet,
  imagesPut,
  imagesPost,
  imagesDelete
}