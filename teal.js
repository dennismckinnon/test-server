var restify = require('restify');
var restifyjwt = require("restify-jwt");
var auth = require('./auth');

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use(restifyjwt({secret: auth.mysecret, getToken: auth.fromQuerystring}).unless({path: ['/login'], method: ['GET']}))

require('./routes')(server);

server.listen(4545);
console.log("Server Running")