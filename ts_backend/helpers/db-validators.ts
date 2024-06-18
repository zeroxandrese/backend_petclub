const { Image, Role, Tipo, Raza, Sexo, User, Comments, Alerts, Like, Pet, Report, CommentsChildren, LikeComments, LikeCommentsChildren, ActionPlan, Notifications } = require('../models/index');

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

/* const isPais = async (pais = "") => {
    const missingPais = await Pais.findOne({ pais });
    if (!missingPais) {
        throw new Error('El pais no se encuentra definido');
    }
}; */

const isActionPlan = async (actionPlan = "") => {
    const missingActionPlan = await ActionPlan.findOne({ actionPlan });
    if (!missingActionPlan) {
        throw new Error('El actionPlan no se encuentra definido');
    }
};

const isSexo = async (sexo = "") => {
    const missingSexo = await Sexo.findOne({ sexo });
    if (!missingSexo) {
        throw new Error('El sexo no se encuentra definido');
    }
};

const isRaza = async (raza = "") => {
    const missingSexo = await Raza.findOne({ raza });
    if (!missingSexo) {
        throw new Error('La raza no se encuentra definida');
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

const findIdNotifications = async (id = "") => {
    const missingId = await Notifications.findById(id);
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

const findIdReport = async (id = "") => {
    const missingId = await Report.findById(id);
    if (!missingId) {
        throw new Error('El id del reporte no se encuentra registrado');
    }
}

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

const findIdComChild = async (id = "") => {
    const missingId = await CommentsChildren.findById(id);
    if (!missingId) {
        throw new Error('El id del comentario no se encuentra registrado');
    }
};

const findIdComChil = async (id = "") => {
    const missingId = await CommentsChildren.findById(id);
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

const findIdLikeComments = async (id = "") => {
    const missingId = await LikeComments.findById(id);
    if (!missingId) {
        throw new Error('El id del comentario no se encuentra registrado');
    }
}

const findIdLikeCommentsChildren = async (id = "") => {
    const missingId = await LikeCommentsChildren.findById(id);
    if (!missingId) {
        throw new Error('El id del comentario no se encuentra registrado');
    }
}

const findIdImgCom = async (id = "") => {
    const missingId = await Image.findOne({ id });
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
    isSexo,
    findEmail,
    findId,
    findIdImg,
    collectionAllowed,
    findIdCom,
    findIdAlert,
    findIdLike,
    findIdImgCom,
    findIdPets,
    isRaza,
    findIdReport,
    findIdComChil,
    findIdLikeComments,
    findIdComChild,
    findIdLikeCommentsChildren,
    isActionPlan,
    findIdNotifications
}