const express = require('express');
// const servicesRouter = require('./services');
const crypto = require('crypto');
const cors = require("cors");
const User = require('../models/user');
const Area = require("../models/area");
const bodyParser = require('body-parser');
const userRouter = require('./userRouter');
const areaRouter = require('./areaRouter');
const oauthLogin = require("./../passport/passportRegistration");
const serviceRegister = require("./../passport/serviceRegistration");
const outlookRouter = require('./outlookAPI');
const googleRouter = require('./googleAPI');
const spotifyRouter = require('./spotifyAPI');

const currencyController = require('../Controller/CurrencyController');
const clockController = require('../Controller/ClockController');
const outlookController = require('../Controller/OutlookController');
const googleController = require('../Controller/GoogleController');
const intraController = require('../Controller/IntraController');
const weatherController = require('../Controller/WeatherController')
const spotifyController = require('../Controller/SpotifyController')


const app = express();
// const mainRouter = express.Router();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());

app.use('/', userRouter);
app.use('/area', areaRouter);
app.use('/oauth', oauthLogin);
app.use('/service', serviceRegister);
app.use('/outlook', outlookRouter);
app.use('/google', googleRouter);
app.use('/spotify', spotifyRouter);

function getTokenfromUser(service, user) {
    var tokenList = user.tokenList;
    for (var i = 0; i < tokenList.length; i++) {
        if (tokenList[i].service === service) {
            return ({
                access_token: tokenList[i].token,
                refresh_token: tokenList[i].refreshToken,
                index: i
            })
        }
    }
    return ({});
}

async function createAction(user, area) {
    if (area.Action === "Outlook") {
        var actionResult = await outlookController.outlookAction(user, area);
        return (actionResult)
    }
    if (area.Action === "Google") {
        var actionResult = await googleController.googleAction(user, area)
        return (actionResult)
    }
    if (area.Action === "Epitech") {
        var actionResult = await intraController.epitechAction(user, area)
        return (actionResult);
    }
    if (area.Action === "Clock") {
        var actionResult = await clockController.clockAction(user, area);
        return (actionResult);
    }
    if (area.Action === "Weather") {
        var actionResult = await weatherController.weatherAction(user, area);
        return (actionResult);
    }
    if (area.Action === "Currency") {
        var actionResult = await currencyController.currencyAction(user, area);
        return (actionResult);
    }
    if (area.Action === "Spotify") {
        var actionResult = await spotifyController.spotifyAction(user, area);
        return (actionResult);
    }
    return (null);
}

async function createReaction(user, area) {
    if (area.Reaction === "Outlook") {
        var actionResult = await outlookController.outlookReaction(user, area);
        return (actionResult);
    }
    if (area.Reaction === "Google") {
        var actionResult = await googleController.googleReaction(user, area)
        return (actionResult);
    }
    if (area.Reaction === "Spotify") {
        var actionResult = await spotifyController.spotifyReaction(user, area)
        return (actionResult);
    }
    return (null);
}

async function areaFunc() {
    await Area.find(async function (err, areaList) {
        var i = 0
        areaList.forEach(async (area) => {
            await User.findOne({ "_id": area.userID }, async function (err, user) {
                if (!err && user) {
                    //var area = area
                    // console.log(area);
                    var resAction = await createAction(user, area)
                    console.log("res action = ", resAction)
                    if (resAction != null && resAction != undefined) {
                        var resReaction = await createReaction(user, area)
                        console.log("res reaction = ", resReaction)
                    }
                }
            })
        })
    })
}

areaFunc()

intervalId = setInterval(areaFunc, 240000);
module.exports = app;