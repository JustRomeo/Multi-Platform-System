const express = require("express");
const cors = require("cors");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fetch = require('node-fetch');
const refresh = require('passport-oauth2-refresh');


const OutlookStrategy = require("passport-outlook");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;

const generateJWT = require("./generateJWT");
const user = require("../models/user");
const { accessSync } = require("fs");

const oauthLogin = express.Router();

const OUTLOOK_CLIENT_ID = "17b92ba4-e055-4e20-a59c-eef5640371fe"
const OUTLOOK_CLIENT_SECRET = "8i435u-YJ5A8efWf3zzq_H_73H_Z9~u~3k"

const GOOGLE_CLIENT_ID = "376944395458-29cfekb0if15npp10sdrpdv6hk4glukv.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "HbJPo99YNOdA3CM4II2EI6QK"

const SPOTIFY_CLIENT_ID = "d076e2ef298c4befa44db7828c6e7f49"
const SPOTIFY_CLIENT_SECRET = "22aff2c6a6d24499837e2b9311f70e22"

var tempUser;

passport.use(new OutlookStrategy({
    clientID: OUTLOOK_CLIENT_ID,
    clientSecret: OUTLOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/oauth/login/outlook/callback'
},
    function (req, refreshToken, accessToken, profile, done) {
        console.log("registration");
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
                    return done(null, newUser);
                } catch (err) {
                    return done(err);
                }
            }
        })
    }
));
// passport.use(
//     new SpotifyStrategy(
//         {
//             clientID: SPOTIFY_CLIENT_ID,
//             clientSecret: SPOTIFY_CLIENT_SECRET,
//             callbackURL: 'http://localhost:8080/oauth/login/spotify/callback',
//         },
//         async function (accessToken, refreshToken, expires_in, profile, done) {
//             console.log(accessToken)
//             console.log(refreshToken)
//             User.findOne({ 'email': "profile.emails[0].value" }, async function (err, person) {
//                 if (err)
//                     res.status(400).json({ message: err.message })
//                 if (person != null) {
//                     var i = 0
//                     for (i; i < person.tokenList.length; i++) {
//                         if (person.tokenList[i].service === "spotify") {
//                             person.tokenList[i].token = accessToken
//                         }
//                     }
//                     User.findOneAndUpdate({ "email": "profile.emails[0].value", "tokenList.service": "spotify" },
//                         { $set: { "tokenList.$.token": accessToken } }, function (error, success) {
//                             if (error)
//                                 console.log(error)
//                             else
//                                 console.log(success)
//                         })
//                     tempUser = person;
//                     return done(null, person);
//                 }
//                 else if (person == null) {
//                     const user = new User({
//                         username: profile.displayName,
//                         email: "profile.emails[0].value",
//                         password: profile.id,
//                         tokenList: [{
//                             service: "spotify",
//                             token: accessToken,
//                             refreshToken: refreshToken,
//                             email: profile.emails[0].value
//                         }]
//                     })
//                     try {
//                         const newUser = await user.save()
//                         tempUser = newUser;
//                         return done(null, newUser);
//                     } catch (err) {
//                         return done(err);
//                     }
//                 }
//             })
//         }
//     )
// );

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/oauth/login/google/callback'
},
    function (req, refreshToken, accessToken, profile, done) {
        console.log(accessToken, refreshToken);
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
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


//route
oauthLogin.use(cors());
oauthLogin.use(passport.initialize());

//outlook login
oauthLogin.get('/login/outlook',
    passport.authenticate('windowslive', {
        session: false,
        scope: [
            'openid',
            'profile',
            'offline_access',
            'https://outlook.office.com/Mail.Read',
            'https://outlook.office.com/Mail.Send',
            'https://outlook.office.com/Mail.ReadWrite',
            'https://outlook.office.com/calendars.readwrite'
        ]
    })
);

oauthLogin.get('/login/outlook/callback',
    passport.authenticate('windowslive', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect("http://localhost:8081")
    });

//spotify login 

// oauthLogin.get('/login/spotify', passport.authenticate('spotify', {
//     session: false,
//     scope: [
//         'user-read-email',
//         'user-library-modify'
//     ],
// }));

// oauthLogin.get(
//     '/login/spotify/callback',
//     passport.authenticate('spotify', { failureRedirect: '/' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('http://localhost:8081');
//     }
// );

//google login

oauthLogin.get('/login/google',
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
    })
);

oauthLogin.get('/login/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect("http://localhost:8081")
    }
);

//get temp user after registration

oauthLogin.get("/getTempUser", async (req, res) => {
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
module.exports = oauthLogin;