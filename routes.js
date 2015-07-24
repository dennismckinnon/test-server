var auth = require('./auth.js')

module.exports = function(server) {
    server.post({url:'/login'}, loginRoute);
    server.get({url:'/hello'}, helloRoute_get);
    server.post('/hello', helloRoute_post);
}

// POST /login
var loginRoute = function(req, res, next) {
    // The local login strategy
    auth.verify(req.body.username, req.body.password, function(err, user){

        if (err != null) {
            res.send(401, "Wrong username or password")
            next()
        } else {
            console.log("Login was successful")
            var token = auth.makeToken(user)
            res.json({token: token});
        }
        next()
    });
};


// GET /hello
var helloRoute_get =function(req, res, next) {
    console.log("yo its a get")
    if(req.user) {
        res.send("Hello " + req.user.username);
    } else {
        res.send("Hello unauthenticated user");
    }

    return next();
};

var helloRoute_post =function(req, res, next) {
    console.log("yo its a post")
    if(req.user) {
        res.send("Hello " + req.user.username);
    } else {
        res.send("Hello unauthenticated user");
    }

    return next();
};