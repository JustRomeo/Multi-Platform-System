const User = require('../models/user');
const Area = require("../models/area");
const Spotify = require("../API/Spotify");

function getTokenfromUser(service, user) {
    var tokenList = user.tokenList;
    for (var i = 0; i < tokenList.length; i++) {
        if (tokenList[i].service === service) {
            return ({
                access_token: tokenList[i].token,
                refresh_token: tokenList[i].refreshToken,
                index: i
            });
        }
    }
    return (null);
}

async function changeNewAlbum(area, actionResult) {
    if (area.data === "" && actionResult !== null) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult }
        }, function (err, success) {
            if (err)
                return ("error");
            else
                return ("success");
        })
        return (null)
    }
    if (actionResult != null && area.data != actionResult) {
        await Area.findOneAndUpdate({ "_id": area._id }, {
            $set: { data: actionResult }
        }, function (err, success) {
            if (err)
                return ("error");
            else
                return ("success");
        })
        return (actionResult);
    }
    return (null)
}

exports.spotifyAction = async (user, area) => {
    var tokens = getTokenfromUser("spotify", user);
    if (tokens != null) {
        var spotify = new Spotify(
            user._id,
            tokens.access_token,
            tokens.refresh_token,
            user.tokenList[tokens.index].email,
            user.username,
            area.ActionParameter);
        await spotify.initializer();
        var actionResult = await spotify.areaFunc();

        if (area.ActionParameter[0] === "newAlbum") {
            return (await changeNewAlbum(area, actionResult));
        }
    }
    return (null)
}

exports.spotifyReaction = async (user, area) => {
    var tokens = getTokenfromUser("spotify", user);
    if (tokens != null) {
        var spotify = new Spotify(
            user._id,
            tokens.access_token,
            tokens.refresh_token,
            user.tokenList[tokens.index].email,
            user.username,
            area.ReactionParameter);
        await spotify.initializer();
        var actionResult = await spotify.areaFunc()
        return (actionResult);
    }
    return (null);
}