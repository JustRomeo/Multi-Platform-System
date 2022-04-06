const JwtStrategy = require("passport-jwt").Strategy;
const ExtractStrategy = require("passport-jwt").ExtractJwt;
const User = require('../models/user')
const fs = require("fs");
const path = require("path");
const { ExtractJwt } = require("passport-jwt");

const passport = require("passport")

const pathToKey = path.join(__dirname, "../", "id_rsa_pub.pem");
const PUBLIC_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: ExtractStrategy.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUBLIC_KEY,
  algorithms: ["RS256"],
};

passport.use(
  new JwtStrategy(options, (jwtPayload, done) => {
    User.findOne({ '_id': jwtPayload.sub }, function (err, user) {
      if (user) {
        done(null, user);
      }
      else {
        console.log(err)
        done(null, false);
      }
    })
      .catch(err => {
        console.log(err)
      })
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("deserialize")
  User.findOne({"_id": id }, function(err, user) {
    if (user)
      done(null, user);
    else
      done(err);
  })
});
