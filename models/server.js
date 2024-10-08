const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
const { dbContection } = require('../database/config');
const { socketController } = require('../controllers/socket');

const limiter = rateLimit({
    max: 200,
    windowMs: 2 * 60 * 1000,
    message: 'Has superado la cantidad de solicitudes permitidas'
})

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server, {
            cors: {
              origin: '*',
              methods: ['GET', 'POST'],
              transports: ['websocket', 'polling']
            },
          });

        this.authPath = '/api/auth';
        this.routerPath = '/api/users';
        this.imgPath = '/api/images';
        this.searchPath = '/api/search';
        this.uploadsPath = '/api/uploads';
        this.commentsPath = '/api/comments';
        this.commentsChildrenPath = '/api/commentsChildren';
        this.alertsPath = '/api/alerts';
        this.likePath = '/api/like';
        this.likeCommentsPath = '/api/likeComments';
        this.likeCommentsChildrenPath = '/api/likeCommentsChildren';
        this.commentsAdminPath = '/api/commentsAdmin';
        this.petPath = '/api/pet';
        this.reportPath = '/api/report';
        this.recoveryPasswordPath = '/api/recoveryPassword';
        this.recoveryPasswordCodePath = '/api/recoveryPasswordCode';
        this.notificationsPath = '/api/notifications';
        this.deleteUserReasonsPath = '/api/deleteUserReasons';
        this.profileRefugiosPath = '/api/profileRefugios';

        // Conectar a base de datos
        this.conectarDB();

        this.sockets();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();

    };

    async conectarDB() {
        await dbContection();
    }

    middlewares() {
        //Cors para restringir peticiones
        this.app.use(cors());
        
        //Configuracion de encabezados proxys
        this.app.set('trust proxy', 1);

        //rateLimit para limitar peticiones por minuto
        this.app.use('/api', limiter);

        // parseo y lectura del body
        this.app.use(express.json());

        // Directorio Publico
        this.app.use(express.static('public'));

        // fileuploads o carga de archivos
        this.app.use( fileUpload ({
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
        this.app.use(this.profileRefugiosPath, require('../routes/profileRefugios'));
    };

    sockets(){
        this.io.on('connection', socketController );
    }

    listen() {
        this.server.listen(this.port)
    }
};

module.exports = Server;