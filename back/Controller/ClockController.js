const User = require('../models/user');
const Area = require("../models/area");
const Horloge = require("../API/Horloge");

async function changeEndOfWeek(area, actionResult) {
    if (area.data === "" && actionResult !== null) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (null)
    }
    if (actionResult != null && area.data != actionResult) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: {
                data: actionResult
            }, function(err, success) {
                if (err)
                    return ("error")
                else
                    return ("success");
            }
        })
        return (actionResult)
    }
    return (null)
}

async function changeSomeHour(area, actionResult) {
    if (area.data === "" && actionResult !== null) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult }
        }, function (err, success) {
            if (err)
                return ("error")
            else
                return ("success");
        })
        return (null)
    }
    var diff = 0
    if (actionResult != null) {
        var oldClock = new Date(area.data);
        diff = (actionResult - oldClock) / (1000 * 60 * 60 * 24)
        console.log("day diff = ", diff);
    }
    if (actionResult != null && diff >= 1) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: {
                data: actionResult
            }, function(err, success) {
                if (err)
                    return ("error")
                else
                    return ("success");
            }
        })
        return (actionResult)
    }
    return (null)
}

exports.clockAction = async (user, area) => {
    var horloge = new Horloge(area.ActionParameter);

    var actionResult = await horloge.areaFunc()
    if (area.ActionParameter[0] === "isEndOfWeek") {
        return (await changeEndOfWeek(area, actionResult))
    }
    if (area.ActionParameter[0] === "isSomeHour") {
        return (await changeSomeHour(area, actionResult))
    }
    return (null);
}