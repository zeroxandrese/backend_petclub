import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { dbContection } from '../database/config';
import { socketController } from '../controllers/socket';

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

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                transports: ['websocket', 'polling']
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
        await dbContection();
    }

    middlewares() {
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

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.routerPath, require('../routes/user'));
        this.app.use(this.imgPath, require('../routes/image'));
        this.app.use(this.searchPath, require('../routes/search'));
        this.app.use(this.uploadsPath, require('../routes/uploads'));
        this.app.use(this.commentsPath, require('../routes/comments'));
        this.app.use(this.commentsChildrenPath, require('../routes/commentsChildren'));
        this.app.use(this.alertsPath, require('../routes/alerts'));
        this.app.use(this.likePath, require('../routes/like'));
        this.app.use(this.likeCommentsPath, require('../routes/likeComments'));
        this.app.use(this.likeCommentsChildrenPath, require('../routes/likeCommentsChildren'));
        this.app.use(this.commentsAdminPath, require('../routes/commentsAdmin'));
        this.app.use(this.petPath, require('../routes/pet'));
        this.app.use(this.reportPath, require('../routes/report'));
        this.app.use(this.recoveryPasswordPath, require('../routes/recoveryPassword'));
        this.app.use(this.recoveryPasswordCodePath, require('../routes/recoveryPasswordCode'));
        this.app.use(this.notificationsPath, require('../routes/notifications'));
        this.app.use(this.deleteUserReasonsPath, require('../routes/deleteUserReasons'));
    }

    sockets() {
        this.io.on('connection', socketController);
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default Server;
