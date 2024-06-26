import express, { type Application } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import dbConnection from '../database/config';
import socketController from '../controllers/socket';

// Importa tus rutas aquí
import authRoutes from '../routes/auth';
import userRoutes from '../routes/user';
import imageRoutes from '../routes/image';
import searchRoutes from '../routes/search';
import uploadRoutes from '../routes/uploads';
import commentRoutes from '../routes/comments';
import commentChildrenRoutes from '../routes/commentsChildren';
import alertRoutes from '../routes/alerts';
import likeRoutes from '../routes/like';
import likeCommentsRoutes from '../routes/likeComments';
import likeCommentsChildrenRoutes from '../routes/likeCommentsChildren';
import commentsAdminRoutes from '../routes/commentsAdmin';
import petRoutes from '../routes/pet';
import reportRoutes from '../routes/report';
import recoveryPasswordRoutes from '../routes/recoveryPassword';
import recoveryPasswordCodeRoutes from '../routes/recoveryPasswordCode';
import notificationRoutes from '../routes/notifications';
import deleteUserReasonsRoutes from '../routes/deleteUserReasons';
import elementsMapRoutes  from '../routes/elementdMap';
import tasksRoutes  from '../routes/tasks';

// Define the rate limiter
const limiter = rateLimit({
    max: 350,
    windowMs: 2 * 60 * 1000, // 2 minutes
    message: 'Has superado la cantidad de solicitudes permitidas'
});

class Server {
    public app: Application;
    public port: string | undefined;
    private server: http.Server;
    private io: SocketIOServer;

    private authPath = '/api/auth';
    private routerPath = '/api/users';
    private imgPath = '/api/images';
    private searchPath = '/api/search';
    private uploadsPath = '/api/uploads';
    private commentsPath = '/api/comments';
    private commentsChildrenPath = '/api/commentsChildren';
    private alertsPath = '/api/alerts';
    private likePath = '/api/like';
    private likeCommentsPath = '/api/likeComments';
    private likeCommentsChildrenPath = '/api/likeCommentsChildren';
    private commentsAdminPath = '/api/commentsAdmin';
    private petPath = '/api/pet';
    private reportPath = '/api/report';
    private recoveryPasswordPath = '/api/recoveryPassword';
    private recoveryPasswordCodePath = '/api/recoveryPasswordCode';
    private notificationsPath = '/api/notifications';
    private deleteUserReasonsPath = '/api/deleteUserReasons';
    private elementsMapPath = '/api/elementsMap';
    private tasksPath = '/api/tasks';

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                //transports: ['websocket', 'polling']
            }
        });

        // Conectar a base de datos
        this.conectarDB();

        // Sockets
        this.sockets();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    private middlewares() {
        // Cors para restringir peticiones
        this.app.use(cors());

        // Configuracion de encabezados proxys
        this.app.set('trust proxy', 1);

        // rateLimit para limitar peticiones por minuto
        this.app.use('/api', limiter);

        // parseo y lectura del body
        this.app.use(express.json());

        // Directorio Publico
        this.app.use(express.static('public'));

        // fileuploads o carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    private routes() {
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.routerPath, userRoutes);
        this.app.use(this.imgPath, imageRoutes);
        this.app.use(this.searchPath, searchRoutes);
        this.app.use(this.uploadsPath, uploadRoutes);
        this.app.use(this.commentsPath, commentRoutes);
        this.app.use(this.commentsChildrenPath, commentChildrenRoutes);
        this.app.use(this.alertsPath, alertRoutes);
        this.app.use(this.likePath, likeRoutes);
        this.app.use(this.likeCommentsPath, likeCommentsRoutes);
        this.app.use(this.likeCommentsChildrenPath, likeCommentsChildrenRoutes);
        this.app.use(this.commentsAdminPath, commentsAdminRoutes);
        this.app.use(this.petPath, petRoutes);
        this.app.use(this.reportPath, reportRoutes);
        this.app.use(this.recoveryPasswordPath, recoveryPasswordRoutes);
        this.app.use(this.recoveryPasswordCodePath, recoveryPasswordCodeRoutes);
        this.app.use(this.notificationsPath, notificationRoutes);
        this.app.use(this.deleteUserReasonsPath, deleteUserReasonsRoutes);
        this.app.use(this.elementsMapPath, elementsMapRoutes);
        this.app.use(this.tasksPath, tasksRoutes);
    }

    private sockets() {
        this.io.on('connection', (socket) => {
            socketController(socket);
        });
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default Server;
