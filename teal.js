var restify = require('restify');

var restifyjwt = require("restify-jwt");

var auth = require('./auth');
//var jwt = require("jsonwebtoken");

//var sessions        = require("client-sessions");



var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());


var mysecret = "itsasecret";

server.use(restifyjwt({secret: mysecret, getToken: auth.fromQuerystring}).unless({path: ['/login'], method: ['GET']}))

require('./routes')(server);

server.listen(4545);
console.log("Server Running")