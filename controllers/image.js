const { response, query } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const fs = require('fs');

const { Image, PawsCount, TokenPoint } = require('../models/index');
const { uploadFileValidation } = require('../helpers/upload-file');

const shuffle = (array) => {
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

const imagesGet = async (req, res = response) => {
  try {
    const { page } = req.query;
    const options = { page: page || 1, limit: 20 };
    const query = { status: true };

    // Obtener todas las imágenes disponibles para la página solicitada
    const images = await Image.paginate(query, options);

    // Mezclar las imágenes obtenidas
    const shuffledImages = shuffle(images.docs);

    // Reemplazar las imágenes mezcladas en la respuesta
    images.docs = shuffledImages;

    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const imagesPut = async (req, res = response) => {

  const id = req.params.id;
  const { status, img, ...image } = req.body;

  const imagen = await Image.findByIdAndUpdate(id, image, { new: true });

  res.status(201).json(imagen);
};

const imagesPost = async (req, res = response) => {
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
      { width: 1000, height: 506, crop: "scale" },
      { quality: "auto" },
    ];

    const commonTransformationLitt = [
      { width: 1000, height: 506, crop: "scale" },
      { quality: "auto" },
      {
        format: 'jpg',
        transformation: [
          { width: 104, height: 104, crop: 'scale' },
        ]
      }
    ];

    function getFileSize(filePath) {
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

      const data = {
        user: uid._id,
        img: videoUploadResult.secure_url,
        descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
        actionPlan: "IMAGE",
      };

      const image = new Image(data);
      await image.save();

      const idResult = await PawsCount.findOne({ user: uid._id });

      if (!idResult) {
          const dataPaw = {
              user: uid._id,
              paws: 2,
              lastUpdate: Date.now()
          }
  
          const paws = new PawsCount(dataPaw);
  
          await paws.save();
      } else {
  
          await PawsCount.findByIdAndUpdate(idResult._id, { paws: idResult.paws + 2, lastUpdate: Date.now() });
  
      }

      const idResultPoint = await TokenPoint.findOne({ user: uid._id });

      if (!idResultPoint) {
          const dataPoint = {
              user: uid._id,
              points: 25,
              lastUpdate: Date.now()
          }
  
          const point = new TokenPoint(dataPoint);
  
          await point.save();
      } else {
  
          await TokenPoint.findByIdAndUpdate(idResultPoint._id, { points: idResultPoint.points + 25, lastUpdate: Date.now() });
  
      }

      res.status(201).json(image);
    } else {
      // Subir imagen a Cloudinary con transformaciones
      const imageUploadResult = await cloudinary.uploader.upload(tempFilePath, {
        eager: commonTransformation
      });

      const data = {
        user: uid._id,
        img: imageUploadResult.secure_url,
        descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
        actionPlan: "IMAGE"
      };

      const image = new Image(data);
      await image.save();

      const idResult = await PawsCount.findOne({ user: uid._id });

      if (!idResult) {
          const dataPaw = {
              user: uid._id,
              paws: 1,
              lastUpdate: Date.now()
          }
  
          const paws = new PawsCount(dataPaw);
  
          await paws.save();
      } else {
  
          await PawsCount.findByIdAndUpdate(idResult._id, { paws: idResult.paws + 1, lastUpdate: Date.now() });
  
      }

      const idResultPoint = await TokenPoint.findOne({ user: uid._id });

      if (!idResultPoint) {
          const dataPoint = {
              user: uid._id,
              points: 10,
              lastUpdate: Date.now()
          }
  
          const point = new TokenPoint(dataPoint);
  
          await point.save();
      } else {
  
          await TokenPoint.findByIdAndUpdate(idResultPoint._id, { points: idResultPoint.points + 10, lastUpdate: Date.now() });
  
      }

      res.status(201).json(image);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error contacte al admin' });
  }
};

const imagesDelete = async (req, res = response) => {
  const id = req.params.id;
  //Borrar imagen permanentemente
  //const img = await Image.findByIdAndDelete( id );

  //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
  const img = await Image.findByIdAndUpdate(id, { status: false });

  res.status(201).json({ img });
};

module.exports = {
  imagesGet,
  imagesPut,
  imagesPost,
  imagesDelete
}