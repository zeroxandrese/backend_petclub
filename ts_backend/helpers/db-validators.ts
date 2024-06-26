import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Esquemas Zod para validar parámetros
const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
const stringSchema = z.string();
const emailSchema = z.string().email();
const collectionSchema = z.enum(['users', 'images', 'pets']);

const isRole = async (role = "") => {

    const validated = stringSchema.parse(role);
    const missingRole = await prisma.role.findFirst({ where: { role: validated } });
    if (!missingRole) {
        throw new Error('El rol no se encuentra definido');
    }
};

const isTipo = async (tipo = "") => {

    const validated = stringSchema.parse(tipo);
    const missingTipo = await prisma.tipo.findFirst({
        where: { tipo: validated }
    });
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

    const validated = stringSchema.parse(actionPlan);
    const missingActionPlan = await prisma.actionPlan.findFirst({ where: { actionPlan: validated } });
    if (!missingActionPlan) {
        throw new Error('El actionPlan no se encuentra definido');
    }
};

const isSexo = async (sexo = "") => {

    const validated = stringSchema.parse(sexo);
    const missingSexo = await prisma.sexo.findFirst({ where: { sexo: validated } });
    if (!missingSexo) {
        throw new Error('El sexo no se encuentra definido');
    }
};

const isRaza = async (raza = "") => {

    const validated = stringSchema.parse(raza);
    const missingSexo = await prisma.raza.findFirst({ where: { raza: validated } });
    if (!missingSexo) {
        throw new Error('La raza no se encuentra definida');
    }
};

const findEmail = async (email = "") => {

    const validated = emailSchema.parse(email);
    const missingEmail = await prisma.user.findUnique({ where: { email: validated } });
    if (missingEmail) {
        throw new Error('El email se encuentra registado');
    }
};

const findId = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.user.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdNotifications = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.notifications.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdImg = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.image.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdReport = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.report.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id del reporte no se encuentra registrado');
    }
}

const collectionAllowed = (collection: string) => {
    try {
        collectionSchema.parse(collection);
        return true;
    } catch (error) {
        throw new Error('La colección no está incluida');
    }
};

const findIdCom = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.comments.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id del comentario no se encuentra registrado');
    }
};

const findIdComChil = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.commentsChildren.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id del comentario no se encuentra registrado');
    }
};

const findIdAlert = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.alerts.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id de la alerta no se encuentra registrado');
    }
}

const findIdLike = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.like.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id del like no se encuentra registrado');
    }
}

const findIdLikeComments = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.likeComments.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id del comentario no se encuentra registrado');
    }
}

const findIdLikeCommentsChildren = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.likeCommentsChildren.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id del comentario no se encuentra registrado');
    }
}

const findIdImgCom = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.image.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

const findIdPets = async (id = "") => {

    const validated = idSchema.parse(id);
    const missingId = await prisma.pet.findUnique({ where: { uid: validated } });
    if (!missingId) {
        throw new Error('El id no se encuentra registrado');
    }
};

export {
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
    findIdLikeCommentsChildren,
    isActionPlan,
    findIdNotifications
}