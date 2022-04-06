const express = require('express');
const User = require('../models/user')
const passport = require('passport');
const fetch = require('node-fetch');
const spotifyRouter = express.Router();

require("../passport/passport");

const SPOTIFY_CLIENT_ID = "d076e2ef298c4befa44db7828c6e7f49"
const SPOTIFY_CLIENT_SECRET = "22aff2c6a6d24499837e2b9311f70e22"

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


async function getArtist(token, artist) {
    var tab = await fetch("https://api.spotify.com/v1/search?q=" + artist + "&type=artist", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        }
    })
        .then(async response => {
            if (response.status === 200) {
                var json = await response.json()
                console.log(json)
                if (json["artists"]["total"] === 0)
                    return ("")
                // console.log(json["artists"]["items"][0])
                return (json["artists"]["items"][0]["id"])
            }
            else {
                var json = await response.json()
                console.log(json);
                return (null)
            }
        })
    return (tab);
}

async function getArtistLastAlbum(token, artistId) {
    var tab = await fetch("https://api.spotify.com/v1/artists/" + artistId + "/albums?market=FR&limit=5", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        }
    })
        .then(async response => {
            if (response.status === 200) {
                var json = await response.json()
                console.log(json["items"][0]["name"])
                return (json["items"][0]["id"])
            }
            else {
                var json = await response.json()
                console.log(json);
                return (null)
            }
        })
    return (tab);
}

async function getAlbumTracks(token, albumId) {
    var tab = await fetch("https://api.spotify.com/v1/albums/" + albumId + "/tracks?market=FR", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        }
    })
        .then(async response => {
            if (response.status === 200) {
                var json = await response.json()
                var tab = [];
                for (var i = 0; i < json["items"].length; i++)
                    tab.push({ id: json["items"][i]["id"], name: json["items"][i]["name"] })
                return (tab)
            }
            else
                return (null)
        })
    return (tab);
}

async function getUserPlaylist(token) {
    var tab = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        }
    })
        .then(async response => {
            if (response.status === 200) {
                var json = await response.json()
                var tab = [];
                for (var i = 0; i < json["items"].length; i++)
                    tab.push({ id: json["items"][i]["id"], name: json["items"][i]["name"] })
                return (tab)
            }
            else
                return (null)
        })
    return (tab);
}



async function refreshToken(token, user) {
    var form = new URLSearchParams();
    form.append('grant_type', 'refresh_token');
    form.append('refresh_token', token);
    var authorization = SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET;
    var encoded = Buffer.from(authorization).toString('base64')
    console.log(encoded);
    var tab = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encoded,
        },
        body: form
    })
        .then(async response => {
            var json = await response.json()
            if (json["token_type"] !== undefined) {
                console.log(json)
                var result = User.findOneAndUpdate({ "email": "profile.emails[0].value", "tokenList.service": "spotify" },
                    { $set: { "tokenList.$.token": json.access_token } }, function (error, success) {
                        if (error)
                            return ("error")
                        else
                            return ("success")
                    })
                return (result);
            }
            else {
                console.log(json);
                return ("failure");
            }
        })
    return (tab)
}

spotifyRouter.get("/getArtist", passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("spotify", req.user);
    const tab = await getArtist(token.access_token, req.body.artist);
    console.log(tab);
    res.status(200).json(tab)
})

spotifyRouter.get("/getArtistLastAlbum", passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("spotify", req.user);
    const tab = await getArtistLastAlbum(token.access_token, req.body.id);
    console.log(tab);
    res.status(200).json(tab)
})


spotifyRouter.get('/getArtistLastAlbumTrack', passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("spotify", req.user);
    const tab = await getAlbumTracks(token.access_token, req.body.albumId);
    console.log(tab);
    res.status(200).json(tab)
})


spotifyRouter.get('/getUserPlaylist', passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("spotify", req.user);
    const tab = await getUserPlaylist(token.access_token);
    console.log(tab);
    res.status(200).json(tab)
})

spotifyRouter.post('/refreshToken', passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("spotify", req.user);
    const tab = await refreshToken(token.refreshToken, req.user);
    console.log(tab);
    res.status(200).json(tab)
})

// spotifyRouter.post('/getUserFavoritePlaylist', passport.authenticate("jwt", { session: false }), async (req, res) => {
//     const tab = await sendEmail(req.user, token.access_token, req.body);
//     console.log(tab);
//     res.status(200).json(tab)
// })

// spotifyRouter.get('/AddArtistLasAlbumToFavorite', passport.authenticate("jwt", { session: false }), async (req, res) => {
//     const tab = await getUserUnreadEmail(req.user.email, token.access_token)
//     console.log(tab);
//     res.status(200).json(tab)
// })

module.exports = spotifyRouter;
