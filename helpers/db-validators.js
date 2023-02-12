const { Image, Role, Tipo, Pais, Sexo, User, Comments, Alerts, Like, Pet } = require('../models/index');

const isRole = async (role = "") => {
    const missingRole = await Role.findOne({ role });
    if (!missingRole) {
        throw new Error('El rol no se encuentra definido');
    }
};

const isTipo = async (tipo = "") => {
    const missingTipo = await Tipo.findOne({ tipo });
    if (!missingTipo) {
        throw new Error('El tipo no se encuentra definido');
    }
};

const isPais = async (pais = "") => {
    const missingPais = await Pais.findOne({ pais });
    if (!missingPais) {
        throw new Error('El pais no se encuentra definido');
    }
};

const isSexo = async (sexo = "") => {
    const missingSexo = await Sexo.findOne({ sexo });
    if (!missingSexo) {
        throw new Error('El sexo no se encuentra definido');
    }
};

const findEmail = async (email = "") => {
    const missingEmail = await User.findOne({ email });
    if (missingEmail) {
        throw new Error('El email se encuentra registado');
    }
};

const findId = async (id = "") => {
    const missingId = await User.findById(id);
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdImg = async (id = "") => {
    const missingId = await Image.findById(id);
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const collectionAllowed = (collection = '', collections = []) => {
    const include = collections.includes(collection);
    if (!include) {
        throw new Error('La coleccion no esta includa');
    }
    return true;
};

const findIdCom = async (id = "") => {
    const missingId = await Comments.findById(id);
    if (!missingId) {
        throw new Error('El id del comentario no se encuentra registrado');
    }
};

const findIdAlert = async (id = "") => {
    const missingId = await Alerts.findById(id);
    if (!missingId) {
        throw new Error('El id de la alerta no se encuentra registrado');
    }
}

const findIdLike = async (id = "") => {
    const missingId = await Like.findById(id);
    if (!missingId) {
        throw new Error('El id del like no se encuentra registrado');
    }
}

const findIdImgCom = async (id = "") => {
    const missingId = await Image.findOne({id});
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdPets = async (id = "") => {
    const missingId = await Pet.findById(id);
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

module.exports = {
    isRole,
    isTipo,
    isPais,
    isSexo,
    findEmail,
    findId,
    findIdImg,
    collectionAllowed,
    findIdCom,
    findIdAlert,
    findIdLike,
    findIdImgCom,
    findIdPets
}