var fs = require('fs-extra');

var jwt = require('jsonwebtoken')

// Nodejs encryption with CTR
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

var mysecret = "itsasecret";

exports.fromQuerystring = function(req) {
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
}

exports.verify = function(username, password, done) {
    //here I need to:
    //temp loading namereg
    var namereg =  fs.readJsonSync("./namereg.json");
    //1) Get user info from chain (Temporarily hardcoding this)

    data = namereg[username];

    if (data === undefined) {
        return done(new Error("Incorrect Username"), false)
    } else {
        //2) Decrypt using AES
        var decipher = crypto.createDecipher(algorithm,password)
        var dec = decipher.update(data.EKEY,'hex','utf8')
        dec += decipher.final('utf8');

        //check its correct
        var shasum = crypto.createHash('sha256');
        shasum.update(dec);
        hash =  shasum.digest('hex');

        if (hash != data.CSUM) {
            return done(new Error("Incorrect Password."), false)
        } else {
            //3) Attach decrypted key to user session
            user = {id: data.ADDR, username: username, DKEY: dec};
            return done(null, user)

        }
    }
}

exports.makeToken = function(user) {
	return jwt.sign(user, mysecret, {expiresInMinutes: 60*5})
}
