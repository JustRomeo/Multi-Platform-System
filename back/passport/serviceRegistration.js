const express = require("express");
const cors = require("cors");
const passport = require("passport");
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const fetch = require('node-fetch');
// const refresh = require('passport-oauth2-refresh');
const Base64 = require('js-base64');

const OutlookStrategy = require("passport-outlook");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;

const generateJWT = require("./generateJWT");
// const user = require("../models/user");
// const { accessSync } = require("fs");

const serviceRegister = express.Router();

const OUTLOOK_CLIENT_ID = "17b92ba4-e055-4e20-a59c-eef5640371fe"
const OUTLOOK_CLIENT_SECRET = "8i435u-YJ5A8efWf3zzq_H_73H_Z9~u~3k"

const GOOGLE_CLIENT_ID = "376944395458-29cfekb0if15npp10sdrpdv6hk4glukv.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "HbJPo99YNOdA3CM4II2EI6QK"

const SPOTIFY_CLIENT_ID = "d076e2ef298c4befa44db7828c6e7f49"
const SPOTIFY_CLIENT_SECRET = "22aff2c6a6d24499837e2b9311f70e22"

var tempUser;
var id = 0;

passport.use(new OutlookStrategy({
    clientID: OUTLOOK_CLIENT_ID,
    clientSecret: OUTLOOK_CLIENT_SECRET,
    callbackURL: 'https://back-area.herokuapp.com/service/addService/outlook/callback'
},
    function (req, refreshToken, accessToken, profile, done) {
        // console.log("request = ", req.query);
        // console.log("access token = ", accessToken)
        // console.log("refresh token = ", refreshToken);
        // console.log("profile = ", profile);
        var newService = {
            service: "outlook",
            token: req,
            refreshToken: refreshToken,
            email: profile.emails[0].value,
        }
        console.log(id);
        console.log(newService);
        if (id != 0) {
            console.log("addService");
            User.findOneAndUpdate({ '_id': id }, { $push: { tokenList: newService } }, function (err, profile) {
                if (err)
                    console.log(err)
                else
                    console.log("success", profile);
                tempUser = profile;
                id = 0;
                return done(null, profile);
            })
        }
        else {
            console.log("login");
            User.findOne({ 'email': profile.emails[0].value }, async function (err, person) {
                if (err)
                    res.status(400).json({ message: err.message })
                if (person != null) {
                    var i = 0
                    for (i; i < person.tokenList.length; i++) {
                        if (person.tokenList[i].service === "outlook") {
                            person.tokenList[i].token = accessToken.access_token
                        }
                    }
                    User.findOneAndUpdate({ "email": profile.emails[0].value, "tokenList.service": "outlook" },
                        { $set: { "tokenList.$.token": accessToken.access_token } }, function (error, success) {
                            if (error)
                                console.log(error)
                            else
                                console.log(success)
                        })
                    tempUser = person;
                    return done(null, person);
                }
                else if (person == null) {
                    const user = new User({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        password: profile.id,
                        tokenList: [{
                            service: "outlook",
                            token: accessToken.access_token,
                            refreshToken: refreshToken,
                            email: profile.emails[0].value
                        }]
                    })
                    try {
                        const newUser = await user.save()
                        tempUser = newUser;
                        console.log("temp user truc");
                        return done(null, newUser);
                    } catch (err) {
                        return done(err);
                    }
                }
            })
        }
        done(null, profile);
    }
));


passport.use(
    new SpotifyStrategy(
        {
            clientID: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
            callbackURL: 'https://back-area.herokuapp.com/service/addService/spotify/callback',
        },
        async function (accessToken, refreshToken, expire_in, profile, done) {
            var newService = {
                service: "spotify",
                token: accessToken,
                refreshToken: refreshToken,
                email: profile.emails[0].value,
            }
            console.log(newService);
            if (id != 0) {
                User.findOneAndUpdate({ '_id': id }, { $push: { tokenList: newService } }, function (err, profile) {
                    if (err)
                        console.log(err)
                    else
                        console.log("success", profile);
                    tempUser = profile;
                    id = 0;
                    console.log("spotify add service");
                    return done(null, profile);
                })
            }
            return done(null, profile);
        }
    )
);

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://back-area.herokuapp.com/service/addService/google/callback'
},
    function (req, refreshToken, accessToken, profile, done) {
        // console.log("request = ", req.query);
        // console.log("access token = ", accessToken)
        // console.log("refresh token = ", refreshToken);
        var newService = {
            service: "google",
            token: req,
            refreshToken: refreshToken,
            email: profile.emails[0].value,
        }
        console.log(newService);
        if (id != 0) {
            User.findOneAndUpdate({ '_id': id }, { $push: { tokenList: newService } }, function (err, profile) {
                if (err)
                    console.log(err)
                else
                    console.log("success", profile);
                tempUser = profile;
                id = 0;
                return done(null, profile);
            })
        }
        else {
            User.findOne({ 'email': profile.emails[0].value }, async function (err, person) {
                if (err)
                    res.status(400).json({ message: err.message })
                if (person != null) {
                    var i = 0
                    for (i; i < person.tokenList.length; i++) {
                        if (person.tokenList[i].service === "google")
                            person.tokenList[i].token = accessToken.access_token
                    }
                    User.findOneAndUpdate({ "email": profile.emails[0].value, "tokenList.service": "google" },
                        {
                            $set: {
                                "tokenList.$.token": accessToken.access_token,
                                "tokenList.$.refreshToken": refreshToken
                            }
                        }, function (error, success) {
                            if (error)
                                console.log(error)
                            else
                                console.log(success)
                        })
                    tempUser = person;
                    return done(null, person);
                }
                else if (person == null) {
                    const user = new User({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        password: profile.id,
                        tokenList: [{
                            service: "google",
                            token: accessToken.access_token,
                            refreshToken: refreshToken,
                            email: profile.emails[0].value
                        }]
                    })
                    try {
                        const newUser = await user.save()
                        tempUser = newUser;
                        return done(null, newUser);
                    } catch (err) {
                        return done(err);
                    }
                }
            })
        }
        return done(null, profile);
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


//route
serviceRegister.use(cors());
serviceRegister.use(passport.initialize());

//outlook login
serviceRegister.get('/addService/outlook', function (req, res) {
    id = req.query.id;
    console.log("id =", id);
    passport.authenticate('windowslive', {
        session: false,
        scope: [
            'openid',
            'profile',
            'offline_access',
            'https://outlook.office.com/Mail.Read',
            'https://outlook.office.com/Mail.Send',
            'https://outlook.office.com/Mail.ReadWrite',
            'https://outlook.office.com/Calendars.ReadWrite'
        ]
    })(req, res);
});

serviceRegister.get('/addService/outlook/callback',
    passport.authenticate('windowslive', { failureRedirect: '/' }),
    function (req, res) {
        if (id != 0)
            res.redirect("http://localhost:8081/dashboard/services")
        else
            res.redirect("http://localhost:8081")
    });

// //spotify login

serviceRegister.get('/addService/spotify', function (req, res) {
    id = req.query.id;
    passport.authenticate('spotify', {
        session: false,
        scope: [
            'user-read-email',
            'user-library-modify'
        ],
    })(req, res)
});

serviceRegister.get('/addService/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function (req, res) {
        console.log("spotify add service redirection");
        res.redirect('http://localhost:8081/dashboard/services');
    }
);

//google login

serviceRegister.get('/addService/google', function (req, res) {
    id = req.query.id;
    console.log(id);
    passport.authenticate('google', {
        session: false,
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.readonly'],
        accessType: 'offline',
        prompt: 'consent',
    })(req, res);
});

serviceRegister.get('/addService/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // console.log(res);
        // console.log(tempUser);
        if (id != 0)
            res.redirect("http://localhost:8081/dashboard/services")
        else
            res.redirect("http://localhost:8081")
    }
);

//get temp user after registration

serviceRegister.get("/getTempUser", async (req, res) => {
    var user = tempUser;
    tempUser = null;
    if (user != null) {
        const jwt = generateJWT(user)
        console.log(jwt);
        var response = {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
            token: jwt.token,
            expireIn: jwt.expires
        }
        res.status(200).json(response);
    }
    else
        res.status(401).json(null)
})
module.exports = serviceRegister;