const User = require('../models/user');
const Area = require("../models/area");
const Weater = require("../API/Meteo");
const Horloge = require("../API/Horloge");


exports.weatherAction = async (user, area) => {
    var weather = new Weater(area.ActionParameter);

    var actionResult = await weather.areaFunc()
    if (area.ActionParameter[0] === "isTempUnder") {
        var referenceDate = new Date();
        var offset = Math.abs(referenceDate.getTimezoneOffset() / 60);
        var d1 = new Date()
        d1.setHours(9 + offset, 0, 0, 0);
        if (area.data === "" && actionResult !== null) {
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
            date = new Date();
            date.setHours(9 + offset, 0, 0, 0);
            var d2 = new Date(area.data);
            diff = (date - d2) / (1000 * 60 * 60 * 24)
        }
        if (actionResult != null && diff >= 1) {
            await Area.findOneAndUpdate({ "_id": area._id }, {
                $set: {
                    data: date
                }, function(err, success) {
                    if (err)
                        return ("error")
                    else
                        return ("success");
                }
            })
            return (actionResult)
        }
    }
    return (null);
}