const User = require('../models/user');
const Area = require("../models/area");
const Outlook = require("../API/Outlook");
const Horloge = require("../API/Horloge");

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
    return (null);
}

async function changeUnreadEmail(area, actionResult) {
    if (area.data === "" && actionResult != null) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult.id }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (null)
    }
    if (actionResult != null && area.data != actionResult.id) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult.id }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        var value = "Mail received from " + actionResult.from + ". Subject: " + actionResult.subject;
        return (value)
    }
    return (null);
}

async function changeIsEvent(area, actionResult) {
    var d1 = new Date();
    var referenceDate = new Date();
    var offset = Math.abs(referenceDate.getTimezoneOffset() / 60);
    d1.setHours(9 + offset, 0, 0, 0);
    if (actionResult != null && actionResult != "" && area.data === "") {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: d1 }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (null)
    }
    var clock = new Horloge(["isSomeHour", "9"])
    var diff = 0;
    var date = "";
    if (clock.isSomeHour() != null) {
        var referenceDate = new Date();
        date = new Date();
        var offset = Math.abs(referenceDate.getTimezoneOffset() / 60);
        date.setHours(9 + offset, 0, 0, 0);
        var d2 = new Date(area.data);
        diff = (date - d2) / (1000 * 60 * 60 * 24)
    }
    if (actionResult != null && actionResult != "" && diff >= 1) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: date }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        var value = "Mail received from " + actionResult.from + ". Subject: " + actionResult.subject;
        return (value)
    }
    return (null);
}

exports.outlookAction = async (user, area) => {
    var tokens = getTokenfromUser("outlook", user);
    if (tokens != null) {
        var outlook = new Outlook(
            user._id,
            tokens.access_token,
            tokens.refresh_token,
            user.tokenList[tokens.index].email,
            user.username,
            area.ActionParameter);
        await outlook.initialize();
        var actionResult = await outlook.areaFunc()

        if (area.ActionParameter[0] === "asUnreadEmail") {
            return (await changeUnreadEmail(area, actionResult));
        }
        if (area.ActionParameter[0] === "isEvent") {
            return (await changeIsEvent(area, actionResult));
        }
    }
    return (null)
}

exports.outlookReaction = async (user, area) => {
    var tokens = getTokenfromUser("outlook", user);
    if (tokens != null) {
        var outlook = new Outlook(
            user._id,
            tokens.access_token,
            tokens.refresh_token,
            user.tokenList[tokens.index].email,
            user.username,
            area.ReactionParameter);
        await outlook.initialize();
        console.log(outlook.param)
        var actionResult = await outlook.areaFunc()
        return (actionResult)
    }
    return (null);
}