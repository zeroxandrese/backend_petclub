



const User = require('./user');
const Pais = require('./pais');
const ActionPlan = require('./actionPlan');
const Role = require('./role');
const Server = require('./server');
const Sexo = require('./sexo');
const Tipo = require('./tipo');
const Image = require('./image');
const Comments = require('./comments');
const CommentsChildren = require('./commentsChildren');
const Alerts = require('./alert');
const Like = require('./like');
const LikeComments = require('./likeComments');
const LikeCommentsChildren = require('./likeCommentsChildren');
const CommentsAdmin = require('./commentsAdmin');
const Pet = require('./pet');
const Raza = require('./raza');
const Report = require('./report');
const RecoveryPassword = require('./recoveryPassword');
const Notifications = require('./notifications');

module.exports = {
User,
Pais, 
Role, 
Server,
Sexo, 
Tipo, 
Image,
Comments,
Alerts,
Like,
CommentsAdmin,
Pet,
Raza,
Report,
CommentsChildren,
LikeComments,
LikeCommentsChildren,
RecoveryPassword,
ActionPlan,
Notifications
}

