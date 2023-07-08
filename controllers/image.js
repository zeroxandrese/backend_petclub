const { response, query } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

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

  let secure_url2 = String;
  const uid = await req.userAuth;
  const { name, tempFilePath } = req.files.file;
  try {
    const nameValidation = await uploadFileValidation(name, undefined);
    
    if (nameValidation === false) {
      return res.status(400).json({
        msg: 'La extensión no está permitida',
      });
    }
    if (nameValidation == 'mp4' || nameValidation == 'mov') {
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: 'video', // Establece el tipo de recurso como "video"
        chunk_size: 6000000, // Tamaño del fragmento en bytes (opcional, ajusta según tus necesidades)
        eager: [
          { format: 'jpg', transformation: [{ width: 500, height: 500, crop: 'fill' }] }, // Genera una miniatura del video
        ],
      });
      secure_url2 = secure_url
    }else{
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
      secure_url2 = secure_url
    };

    const data = {
      user: uid._id,
      img: secure_url2,
      descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
    };

    const image = new Image(data);
    await image.save();

    res.status(201).json(image);
  } catch (error) {
    console.log(error);
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