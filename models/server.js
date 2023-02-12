const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbContection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.authPath = '/api/auth';
        this.routerPath = '/api/users';
        this.imgPath = '/api/images';
        this.searchPath = '/api/search';
        this.uploadsPath = '/api/uploads';
        this.commentsPath = '/api/comments';
        this.alertsPath = '/api/alerts';
        this.likePath = '/api/like';
        this.commentsAdminPath = '/api/commentsAdmin';
        this.petPath = '/api/pet';


        // Conectar a base de datos
        this.conectarDB();

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
        this.app.use(this.alertsPath, require('../routes/alerts'));
        this.app.use(this.likePath, require('../routes/like'));
        this.app.use(this.commentsAdminPath, require('../routes/commentsAdmin'));
        this.app.use(this.petPath, require('../routes/pet'));
    };

    listen() {
        this.app.listen(this.port)
    }
};

module.exports = Server;