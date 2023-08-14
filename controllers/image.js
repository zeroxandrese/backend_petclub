const { response, query } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const { Image } = require('../models/index');
const { uploadFileValidation } = require('../helpers/upload-file');

const imagesGet = async (req, res = response) => {
  const { page } = req.query;
  const options = { page: page || 1, limit: 10 }
  const query = { status: true };

  // se estan enviando dos promesas al mismo tiempo para calcular el paginado de imagenes
  const imagenes = await Image.paginate({}, options)
  res.status(201).json(imagenes)
}

const imagesPut = async (req, res = response) => {

  const id = req.params.id;
  const { status, img, ...image } = req.body;

  const imagen = await Image.findByIdAndUpdate(id, image);

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

    // Validacion Video
    if (nameValidation === 'mp4' || nameValidation === 'mov') {
      const videoDuration = await getVideoDuration(tempFilePath);
      const videoSize = getFileSize(tempFilePath);

      if (videoDuration > MAX_VIDEO_DURATION_SECONDS) {
        return res.status(400).json({
          msg: 'El video es demasiado largo',
        });
      }

      if (videoSize > MAX_VIDEO_SIZE_BYTES) {
        return res.status(400).json({
          msg: 'El video es demasiado grande',
        });
      }

      const convertedFilePath = `${tempFilePath}_converted.mp4`;

      // Conversión del video usando fluent-ffmpeg
      ffmpeg()
        .input(tempFilePath)
        .output(convertedFilePath)
        .on('end', async () => {
          const { secure_url } = await cloudinary.uploader.upload(convertedFilePath, {
            resource_type: 'video',
            chunk_size: 6000000,
            eager: [{ format: 'jpg', transformation: [{ width: 500, height: 500, crop: 'fill' }] }],
          });

          secure_url2 = secure_url;

          // Eliminacion del archivo convertido localmente
          fs.unlinkSync(convertedFilePath);

          const data = {
            user: uid._id,
            img: secure_url2,
            descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
          };

          const image = new Image(data);
          await image.save();

          res.status(201).json(image);
        })
        .on('error', (err) => {
          console.error('Error en la conversión de video:', err);
          res.status(500).json({ error: 'Error contacte al admin' });
        })
        .run();
    } else {
      // Carga la imagen a Cloudinary
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
      secure_url2 = secure_url;

      const data = {
        user: uid._id,
        img: secure_url2,
        descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
      };

      const image = new Image(data);
      await image.save();

      res.status(201).json(image);
    }
  } catch (error) {
    console.error('Error en la función imagesPost:', error);
    res.status(500).json({ error: 'Error contacte al admin' });
  };

  const MAX_VIDEO_DURATION_SECONDS = 60;
  const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;

  function getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size;
  }

  const getVideoDuration = async (filePath) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const duration = metadata.format.duration;
          resolve(duration);
        }
      });
    });
  };

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