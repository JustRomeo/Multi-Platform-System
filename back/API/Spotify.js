const User = require('../models/user')
const fetch = require('node-fetch');
const Base64 = require('js-base64');
const FormData = require('form-data');
// const { all } = require('../routers/app');

require("../passport/passport");

const SPOTIFY_CLIENT_ID = "d076e2ef298c4befa44db7828c6e7f49"
const SPOTIFY_CLIENT_SECRET = "22aff2c6a6d24499837e2b9311f70e22"

class Spotify {
    userId = "";
    token = "";
    refreshToken = "";
    email = "";
    username = "";
    param = "";

    constructor(userId, token, refreshToken, email, username, actionParameter) {
        this.userId = userId;
        this.token = token;
        this.refreshToken = refreshToken;
        this.email = email;
        this.username = username;
        this.param = actionParameter
    }

    set setToken(val) {
        this.token = val
    }

    async initializer() {
        var res = await this.getUser()
        if (res === null) {
            var value = await this.refreshAccessToken();
            console.log("refresh spotify token");
            this.setToken = value;
        }
    }

    async getUser() {
        var tab = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    return ("ok")
                }
                else
                    return (null)
            })
        return (tab);
    }

    async areaFunc() {
        if (this.param[0] === "newAlbum") {
            return (await this.getNewAlbum(this.param[1]))
        }
        if (this.param[0] === "addToSavedTrack") {
            return (await this.addTrackToSaved())
        }
    }

    async getNewAlbum(artistName) {
        var id = await this.getArtist(artistName);
        if (id != null) {
            var albumId = await this.getArtistLastAlbum(id);
            if (albumId != null)
                return (albumId);
        }
        return (null)
    }

    async getAllTrackFromArtistLastAlbum(artistName) {
        var id = await this.getArtist(artistName);
        if (id != null) {
            var albumId = await this.getArtistLastAlbum(id);
            if (albumId != null) {
                var allTrack = await this.getAlbumTracks(albumId);
                if (allTrack != null)
                    return (allTrack);
            }
        }
        return (null)
    }

    async getArtist(artist) {
        var tab = await fetch("https://api.spotify.com/v1/search?q=" + artist + "&type=artist", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json()
                    if (json["artists"]["total"] === 0)
                        return (null)
                    // console.log(json["artists"]["items"][0])
                    return (json["artists"]["items"][0]["id"])
                }
                else
                    return (null)
            })
        return (tab);
    }

    async getArtistLastAlbum(artistId) {
        var tab = await fetch("https://api.spotify.com/v1/artists/" + artistId + "/albums?market=FR&limit=5", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json()
                    return (json["items"][0]["id"])
                }
                else
                    return (null)
            })
        return (tab);
    }

    async getAlbumTracks(albumId) {
        var tab = await fetch("https://api.spotify.com/v1/albums/" + albumId + "/tracks?market=FR", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token,
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

    async getUserPlaylist() {
        var tab = await fetch("https://api.spotify.com/v1/me/playlists", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token,
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

    async addTrackToSaved() {
        var tracks = await this.getAllTrackFromArtistLastAlbum(this.param[2])
        var ids = "";
        for (var i = 0; i < tracks.length; i++) {
            ids += tracks[i].id;
            ids += ",";
        }
        var tab = await fetch("https://api.spotify.com/v1/me/tracks?ids=" + ids, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    return ("ok")
                }
                else
                    return (null)
            })
        return (tab);
    }

    async refreshAccessToken() {
        var form = new URLSearchParams();
        form.append('grant_type', 'refresh_token');
        form.append('refresh_token', this.refreshToken);
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
                    var result = User.findOneAndUpdate({ "_id": this.userId, "tokenList.service": "spotify" },
                        { $set: { "tokenList.$.token": json.access_token } }, function (error, success) {
                            if (error)
                                return ("error")
                            else
                                return ("success")
                        })
                    return (json.access_token);
                }
                else {
                    return ("failure");
                }
            })
        return (tab)
    }

}

module.exports = Spotify