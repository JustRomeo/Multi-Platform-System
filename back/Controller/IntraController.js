const User = require('../models/user');
const Area = require("../models/area");
const Epitech = require("../API/Epitech");

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

async function changeGPA(area, actionResult) {
    if (area.data === "" && actionResult !== null) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (null);
    }
    else if (actionResult != null && area.data != actionResult) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (actionResult)
    }
    return (null)
}

async function changeCredits(area, actionResult) {
    if (area.data === "" && actionResult !== null) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (null);
    }
    else if (actionResult != null && area.data != actionResult) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (actionResult)
    }
    return (null)
}

async function changeValue(area, actionResult) {
    if (area.data === "" && actionResult !== null) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult.id }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (null);
    }
    else if (actionResult != null && area.data != actionResult.id) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult.id }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (actionResult)
    }
    return (null)
}

async function changeMissed(area, actionResult) {
    if (area.data === "" && actionResult !== null) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult.link_event }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (null);
    }
    else if (actionResult != null && area.data != actionResult.link_event) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult.link_event }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (actionResult)
    }
    return (null)
}

async function changeEndOfProject(area, actionResult) {
    if (area.data === "" && actionResult !== null) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (actionResult);
    }
    return (null)
}

exports.epitechAction = async (user, area) => {
    var tokens = getTokenfromUser("intra", user)

    if (tokens != null) {
        var intra = new Epitech(user._id,
            tokens.access_token,
            user.tokenList[tokens.index].email,
            user.username,
            area.ActionParameter)
        var actionResult = await intra.areaFunc();
        if (area.ActionParameter[0] === "getGPA") {
            // console.log("gpa = ", actionResult);
            return (await changeGPA(area, actionResult));
        }
        if (area.ActionParameter[0] === "getCredits") {
            // console.log("credits = ", actionResult);
            return (await changeCredits(area, actionResult));
        }
        if (area.ActionParameter[0] === "getNotification") {
            console.log("notification = ", actionResult.id);
            return (await changeValue(area, actionResult));
        }
        if (area.ActionParameter[0] === "getMissed") {
            if (actionResult != undefined && actionResult != null) {
                // console.log("last missed = ", actionResult);
                return (await changeMissed(area, actionResult));
            }
            return (null);
        }
        if (area.ActionParameter[0] === "getEndProject") {
            console.log("project end in  = ", actionResult, "day");
            if (actionResult < 1) {
                return (await changeEndOfProject(area, actionResult));
            }
            else
                return (null)
        }
    }
    return (null);
}