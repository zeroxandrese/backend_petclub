const { response, query } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { Pet, Image, PawsCount, TokenPoint } = require('../models/index');
const { uploadFileValidation } = require('../helpers/upload-file');

const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    apiKey: process.env.key,
};


const geocoder = NodeGeocoder(options);

const petsGet = async (req, res = response) => {
    const { page } = req.query;
    const options = { page: page || 1, limit: 10 }
    const query = { status: true };

    const pets = await Pet.paginate(query, options)
    res.status(201).json(pets);
};

const petsGetOneOfUser = async (req, res = response) => {
    const id = req.params.id;

    // Se busca al un id de mascota es especifico
    const pet = await Pet.findById(id);
    res.status(201).json({ pet });
};

const petsGetAllOfUser = async (req, res = response) => {
    const id = req.params.id;

    // Se busca al un id de mascota es especifico
    const pet = await Pet.find({ id });
    res.status(201).json({ pet });
};

const petsPut = async (req, res = response) => {
    const id = req.params.id;
    const { ...pet } = req.body;
    const { perdido, lantitudeEvento, fechaEvento, longitudeEvento, horaEvento, nombre, sexo, tipo, edad, raza, descripcion } = req.body;

    try {
        const petPutValidation = await Pet.findById(id);

        if (petPutValidation.perdido === false && perdido === true && longitudeEvento && lantitudeEvento && fechaEvento && horaEvento) {

            const lantitudePerdidaNumber = parseFloat(lantitudeEvento);
            const longitudePerdidaNumber = parseFloat(longitudeEvento);

            const resAddress = await geocoder.reverse({ lat: lantitudePerdidaNumber, lon: longitudePerdidaNumber });
            const dateLost = fechaEvento ? new Date(fechaEvento) : null;
            const dayLost = dateLost?.getDate();
            const monthNamesLost = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const monthIndexLost = dateLost?.getMonth() ?? null;
            const yearLost = dateLost?.getFullYear();

            const data = {
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
                finalUserVisibleDate: `${dayLost} de ${monthNamesLost[monthIndexLost]} del ${yearLost}`
            };

            const image = new Image(data);
            await image.save();

            // Actualiza la mascota y envía una respuesta 201 Created
            const mascota = await Pet.findByIdAndUpdate(id, pet, { new: true });
            return res.status(201).json({ pet: mascota });

        }

        if (petPutValidation.perdido === true) {
            if (perdido === true) {
                return res.status(400).json({ msg: 'La mascota ya fue reportada.' });
            } else {
                const mascota = await Pet.findByIdAndUpdate(id, pet, { new: true });
                const resp = await Image.findOne({ user: petPutValidation.user, status: true, pet: id, actionPlan: "LOST" });
                if (resp) {
                    await Image.findByIdAndUpdate(resp._id, { status: false });
                }
                return res.status(201).json({ pet: mascota });
            }
        }

        if (nombre || sexo || tipo || edad || raza || descripcion) {
            const pets = await Pet.findByIdAndUpdate(petPutValidation._id, pet, { new: true });
            return res.status(201).json({ pet: pets });
        }

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({ msg: 'Algo salió mal, contacte con el administrador' });
    }
};

const petsPost = async (req, res = response) => {

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

        const data = {
            user: uid._id,
            img: secure_url,
            nombre: req.body.data ? JSON.parse(req.body.data).nombre : '',
            sexo: req.body.data ? JSON.parse(req.body.data).sexo : '',
            tipo: req.body.data ? JSON.parse(req.body.data).tipo : '',
            edad: req.body.data ? JSON.parse(req.body.data).edad : '',
            descripcion: req.body.data ? JSON.parse(req.body.data).descripcion : '',
            raza: req.body.data ? JSON.parse(req.body.data).raza : ''
        };

        const pet = new Pet(data);

        await pet.save();

        const idResult = await PawsCount.findOne({ user: uid._id });

        if (!idResult) {
            const dataPaw = {
                user: uid._id,
                paws: 5,
                lastUpdate: Date.now()
            }

            const paws = new PawsCount(dataPaw);

            await paws.save();
        } else {

            await PawsCount.findByIdAndUpdate(idResult._id, { paws: idResult.paws + 5, lastUpdate: Date.now() });

        }

        const idResultPoint = await TokenPoint.findOne({ user: uid._id });

        if (!idResultPoint) {
            const dataPoint = {
                user: uid._id,
                points: 50,
                lastUpdate: Date.now()
            }
    
            const point = new TokenPoint(dataPoint);
    
            await point.save();
        } else {
    
            await TokenPoint.findByIdAndUpdate(idResultPoint._id, { points: idResultPoint.points + 50, lastUpdate: Date.now() });
    
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

const petsDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar usuario permanentemente
    //const usuario = await User.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const pet = await Pet.findByIdAndUpdate(id, { status: false, new: true });

    res.status(201).json({ pet });
};

module.exports = {
    petsGet,
    petsPut,
    petsPost,
    petsDelete,
    petsGetOneOfUser,
    petsGetAllOfUser
}