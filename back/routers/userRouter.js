const express = require('express');
const User = require('../models/user')
const controller = require("../passport/UserController");
const passport = require('passport');
const bcrypt = require('bcrypt');
const generateJWT = require("./../passport/generateJWT");
const fetch = require('node-fetch');

const userRouter = express.Router();

require("../passport/passport");

userRouter.get('/', function (req, res) {
    res.send('home page');
});
userRouter.get('/about.json', function (req, res) {
    const file = {
        "client": {
            "host": String(req.ip).split(':')[3]
        },
        "server": {
            "current_time": Date.now(),
            "services": [{
                "name": "Outlook",
                "actions": [
                    {
                        "name": "asUnreadEmail",
                        "description": "check if there is unread email in you outlook mail box",
                    },
                    {
                        "name": "isEvent",
                        "description": "check if you have event for the X next days in your outlook calendar",
                    }],
                "reactions": [
                    {
                        "name": "sendEmail",
                        "description": "send email to your outlook mail box",
                    },
                    {
                        "name": "createEvent",
                        "description": "create and event in outlook caledendar",
                    }]
            }, {
                "name": "Google",
                "actions": [
                    {
                        "name": "asUnreadEmail",
                        "description": "check if there is unread email in you google mail box",
                    },
                    {
                        "name": "isEvent",
                        "description": "check if you have event for the X next days in your google calendar",
                    },
                    {
                        "name": "getNewVideo",
                        "description": "check if someone of your subscribed channel has posted a new video",
                    }],
                "reactions": [
                    {
                        "name": "sendEmail",
                        "description": "send email to you're google mail box",
                    },
                    {
                        "name": "createEvent",
                        "description": "create and event in google caledendar",
                    },
                    {
                        "name": "addVideoToWatchLater",
                        "description": "add the last video posted by someone of your subscribed channel to the playlist of you choice",
                    }]
            },
            {
                "name": "Epitech",
                "actions": [
                    {
                        "name": "getGPA",
                        "description": "check if your gpa has changed",
                    },
                    {
                        "name": "getCredits",
                        "description": "check if your number of credits has changed",
                    },
                    {
                        "name": "getMissed",
                        "description": "check if you have a new last missed session",
                    },
                    {
                        "name": "getNotification",
                        "description": "check if you have a new notification",
                    },
                    {
                        "name": "getEndProjet",
                        "description": "check if a projet of you choice end in less than 24 hours",
                    }]
            },
            {
                "name": "Spotify",
                "actions": [
                    {
                        "name": "newAlbum",
                        "description": "check if an artist of your choice has posted a new album",
                    }],
                "reactions": [
                    {
                        "name": "addToSavedTrack",
                        "description": "add all tracks from the last album from an artist of your choice to your favorite playlist",
                    }]
            },
            {
                "name": "Currency",
                "actions": [
                    {
                        "name": "isCurrencyUnder",
                        "description": "check if a currency goes below X dollars",
                    }]
            },
            {
                "name": "Weather",
                "actions": [
                    {
                        "name": "isTempUnder",
                        "description": "check temp of city of your choice goes below X degrees",
                    }]
            },
            {
                "name": "Clock",
                "actions": [
                    {
                        "name": "isEndOfWeek",
                        "description": "check if we started a new week",
                    },
                    {
                        "name": "iSomeHour",
                        "description": "check it's a certain hour of the day",
                    }]
            }
            ]
        }
    }
    res.status(200).json(file);
});

const encryptRound = 8;

//post route
userRouter.post('/register', async (req, res) => {
    console.log(req.body)
    if (req.body.password === undefined || req.body.password === "") {
        res.status(400).send("can't register with no password");
        return;
    }
    User.findOne({ 'email': req.body.email }, async function (err, person) {
        if (err || person != null) {
            res.status(400).send('Email already used')
        }
        else {
            var password = await bcrypt.hash(req.body.password, encryptRound);
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: password,
                tokenList: req.body.tokenList === undefined || req.body.tokenList.length === 0 ? [] : req.body.tokenList
            })
            try {
                const newUser = await user.save()
                res.status(201).json(newUser)
            } catch (err) {
                res.status(400).json({ message: err.message })
            }
        }
    })
})

userRouter.post("/mobileRegistration", async (req, res) => {
    User.findOne({ 'email': req.body.email }, async function (err, person) {
        if (err) {
            res.status(400).json({ message: err.message })
            return;
        }
        if (person != null) {
            console.log("login");
            var i = 0
            for (i; i < person.tokenList.length; i++) {
                if (person.tokenList[i].service === req.body.service) {
                    person.tokenList[i].token = req.body.token
                }
            }
            User.findOneAndUpdate({ "email": req.body.email, "tokenList.service": "google" },
                { $set: { "tokenList.$.token": req.body.token } }, function (error, user) {
                    if (error)
                        console.log(error)
                    else {
                        const jwt = generateJWT(user);
                        console.log(jwt)
                        res.status(201).json({
                            user: user,
                            token: jwt.token,
                            expiresIn: jwt.expires,
                        });
                        return;
                    }
                })
        }
        else if (person == null) {
            console.log("register");
            const user = new User({
                username: req.body.displayName,
                email: req.body.email,
                password: req.body.id,
                tokenList: [{
                    service: "google",
                    token: req.body.token,
                    refreshToken: req.body.refreshToken,
                    email: req.body.email
                }]
            })
            try {
                const newUser = await user.save()
                const jwt = generateJWT(newUser);
                console.log(jwt)
                res.status(201).json({
                    user: user,
                    token: jwt.token,
                    expiresIn: jwt.expires,
                });
                return;
            } catch (err) {
                res.status(400).json("error when register user");
            }
        }
    })
});

userRouter.post('/removeUserById', async (req, res) => {
    User.findOneAndDelete({ '_id': req.body.id }, async function (err, person) {
        if (err)
            res.status(400).send('can t remove user')
        else
            res.status(200).send('user removed')
    })
})

userRouter.post('/removeUserByEmail', async (req, res) => {
    User.findOneAndDelete({ 'email': req.body.email }, async function (err, person) {
        if (err)
            res.status(400).send('can t remove user')
        else
            res.status(200).send('user removed')
    })
})

userRouter.post('/login', controller.loginUser);


userRouter.post("/addServiceToken", passport.authenticate("jwt", { session: false }), controller.addServiceToken)
userRouter.post("/addIntraToken", passport.authenticate("jwt", { session: false }), controller.addIntraToken)
userRouter.post("/addGoogleToken", passport.authenticate("jwt", { session: false }), controller.addGoogleToken)
userRouter.post("/addOutlookToken", passport.authenticate("jwt", { session: false }), controller.addOutlookToken)
userRouter.post("/addSpotifyToken", passport.authenticate("jwt", { session: false }), controller.addSpotifyToken)

userRouter.post("/removeServiceToken", passport.authenticate("jwt", { session: false }), controller.removeServiceToken)

//get route
userRouter.get("/getUserInfo", passport.authenticate("jwt", { session: false }), controller.getUserInfo)

userRouter.get("/getServiceToken", passport.authenticate("jwt", { session: false }), controller.getServiceToken)


userRouter.get("/testLogged", passport.authenticate("jwt", { session: false }), controller.testLogged)


module.exports = userRouter;