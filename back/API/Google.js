const User = require('../models/user')
const fetch = require('node-fetch');
const Base64 = require('js-base64');
const FormData = require('form-data');

require("../passport/passport");


const GOOGLE_CLIENT_ID = "376944395458-29cfekb0if15npp10sdrpdv6hk4glukv.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "HbJPo99YNOdA3CM4II2EI6QK"


class Google {
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
        var res = await this.getMail()
        if (res === null) {
            var value = await this.refreshAccessToken();
            console.log("param ", this.param);
            console.log("refresh google token = ", value);
            this.setToken = value;
        }
    }


    async getMail() {
        var tab = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?includeSpamTrash=false&maxResults=5&access_token=' + this.token, {
            method: 'GET',
        })
            .then(async response => {
                var json = await response.json();
                if (json["error"] === undefined) {
                    return ("success")
                }
                else {
                    // console.log(json)
                    return (null);
                }
            })
        return (tab)
    }

    async refreshAccessToken() {
        const form = new FormData();
        console.log(this.refreshToken);
        form.append("grant_type", "refresh_token");
        form.append('refresh_token', this.refreshToken);
        form.append("scope", "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly");
        form.append("client_id", GOOGLE_CLIENT_ID);
        form.append("client_secret", GOOGLE_CLIENT_SECRET);
        var tab = await fetch("https://www.googleapis.com/oauth2/v4/token", {
            method: "POST",
            headers: {
                'Content_Type': "application/x-www-form-urlencoded",
            },
            body: form
        })
            .then(async response => {
                var json = await response.json()
                // console.log(json)
                if (json["token_type"] !== undefined) {
                    User.findOneAndUpdate({ "_id": this.userId, "tokenList.service": "google" },
                        { $set: { "tokenList.$.token": json.access_token } }, function (error, success) {
                            if (error)
                                return ("error")
                            else
                                return ("success")
                        })
                    return (json.access_token);
                }
                else {
                    return (null);
                }
            })
        return (tab)
    }

    mailHeaderParser(mail, index) {
        for (var i = 0; i < mail["payload"]["headers"].length; i++) {
            if (mail["payload"]["headers"][i]["name"] === index) {
                var str = mail["payload"]["headers"][i]["value"];
                if (index === "From")
                    return (str.split('<').pop().split('>')[0]);
                return (mail["payload"]["headers"][i]["value"]);
            }
        }
        return "";
    }


    async areaFunc() {
        if (this.param[0] === "asUnreadEmail")
            return (await this.getUserUnreadEmail());
        if (this.param[0] === "createEvent")
            return (await this.createEvent())
        if (this.param[0] === "sendEmail")
            return (await this.sendEmail())
        if (this.param[0] === "getNewVideo")
            return (await this.getNewVideo(this.param[1]))
        if (this.param[0] === "addVideoToWatchLater")
            return (await this.addVideoToWatchLater())
        if (this.param[0] === "isEvent")
        return (await this.isEvent())
        if (this.param[0] === "getEmailFolder")
            console.log("unreadEmail");
        return ("area not found");
    }

    checkLabel(label) {
        if (label != undefined) {
            for (var i = 0; i < label.length; i++) {
                if (label[i] === "UNREAD")
                    return (1);
            }
        }
        return (0);
    }

    checkUnreadEmail(json) {
        if (this.param.length != 1) {
            if (this.param[1] === "from") {
                if (this.mailHeaderParser(json, "From") === this.param[2]) {
                    return (true)
                }
            }
            if (this.param[1] === "subject") {
                if (this.mailHeaderParser(json, "Subject") == this.param[2])
                    return (true)
            }
            return (false);
        }
        return (true)
    }

    async getUserUnreadEmail() {
        var tab = await fetch('https://gmail.googleapis.com/gmail/v1/users/' + this.email + '/messages?includeSpamTrash=false&maxResults=5&access_token=' + this.token, {
            method: 'GET',
        })
            .then(async response => {
                var json = await response.json();
                if (json["error"] === undefined) {
                    for (var i = 0; i < json["messages"].length; i++) {
                        var id = json["messages"][i]['id']
                        var tab = await fetch('https://gmail.googleapis.com/gmail/v1/users/' + this.email + '/messages/' + id + '?access_token=' + this.token, {
                            method: 'GET',
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                            .then(async response => {
                                var json = await response.json()
                                if (response.status === 200) {
                                    if (this.checkLabel(json["labelIds"]) === 1 &&
                                        this.checkUnreadEmail(json) === true) {
                                        var tab = {
                                            id: json["id"],
                                            subject: this.mailHeaderParser(json, "Subject"),
                                            from: this.mailHeaderParser(json, "From")
                                        }
                                        return (tab)
                                    }
                                }
                                else {
                                    console.log(json)
                                    return (null);
                                }
                            })
                        if (tab != undefined)
                            return (tab)
                        return (null)
                    }
                }
                else
                    return ("error");
            })
        return (tab)
    }

    async getContent() {
        if (this.param[3] != "getEvent" && this.param[3] != "getWeather")
            return (this.param[3])
        if (this.param[3] === "getWeather") {
            var weather = new Weather(["content"])
            var tab = await weather.getWeather(this.param[4])
            console.log("tab = ", tab);
            return (tab)
        }
        if (this.param[3] === "getEvent") {
            return await this.getEvent(parseInt(this.param[4]))
        }
    }

    async sendEmail() {
        var content = await this.getContent();
        let req = ["To: ", this.param[1], "\n",
            "From: ", this.email, "\n",
            "Subject: ", this.param[2], "\n\n",
            content].join('')
        var encoded = Base64.encode(req);
        console.log(encoded)
        var tab = await fetch('https://gmail.googleapis.com/gmail/v1/users/' + this.email + '/messages/send', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify({
                "raw": encoded
            })
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json();
                    return (json);
                }
                else {
                    var json = await response.json();
                    console.log(json)
                    return (null)
                }
            })
        return (tab);
    }

    async getEvent(nbDay) {
        let date = new Date()
        var d1 = new Date().toISOString();
        var lastday = date.getDate() + parseInt(nbDay);
        var nextWeek = new Date(date.setDate(lastday)).toISOString();
        var tab = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMax=' + nextWeek + '&timeMin=' + d1, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json();
                    var tab = "";
                    for (var i = 0; i < json["items"].length; i++) {
                        tab += "Event at " + json["items"][i]["start"]["dateTime"];
                        tab += " finish at " + json["items"][i]["end"]["dateTime"];
                        tab += ". Subject " + json["items"][i]["summary"];
                        tab += " created by " + json["items"][i]["creator"]["email"];
                        tab += "\n"
                    }
                    return (tab);
                }
                else
                    return (null);
            })
        return (tab);
    }

    async isEvent() {
        let date = new Date()
        var d1 = new Date().toISOString();
        var lastday = date.getDate() + parseInt(this.param[1]);
        var nextWeek = new Date(date.setDate(lastday)).toISOString();
        var tab = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMax=' + nextWeek + '&timeMin=' + d1, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json();
                    var tab = "";
                    for (var i = 0; i < json["items"].length; i++) {
                        tab += "Event at " + json["items"][i]["start"]["dateTime"];
                        tab += " finish at " + json["items"][i]["end"]["dateTime"];
                        tab += ". Subject " + json["items"][i]["summary"];
                        tab += " created by " + json["items"][i]["creator"]["email"];
                        tab += "\n"
                    }
                    return (tab);
                }
                else
                    return (null);
            })
        return (tab);
    }

    getDateTime(time, start) {
        if (time === "night") {
            var date = new Date();
            if (start === 1)
                date.setHours(19, 0, 0, 0);
            else
                date.setHours(20, 0, 0, 0);
            console.log(date.toLocaleString())
            return (date);
        }
        else {
            console.log(new Date(time).getTimezoneOffset())
            return (new Date(time).toISOString());
        }
    }

    async createEvent() {
        var startDatetime = this.getDateTime(this.param[2], 1)
        var endDatetime = this.getDateTime(this.param[3], 0)
        console.log("token = ", this.token);
        var tab = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify({
                "end": {
                    "dateTime": endDatetime,
                    "timeZone": "Europe/Paris",
                },
                "start": {
                    "dateTime": startDatetime,
                    "timeZone": "Europe/Paris",
                },
                "summary": this.param[1]
            })
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json();
                    return (json);
                }
                else {
                    var json = await response.json()
                    console.log(json);
                    return (null);
                }
            })
        return (tab);
    }

    async getSubscription(token, nextPageToken) {
        var request = "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&maxResults=50&mine=true";
        if (nextPageToken !== undefined) {
            request += "&pageToken=" + nextPageToken;
        }
        var tab = await fetch(request, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        })
            .then(async response => {
                var json = await response.json();
                if (response.status === 200) {
                    var nextPageToken = json["nextPageToken"];
                    var tab = [];
                    for (var i = 0; i < json["items"].length; i++) {
                        channel = {
                            title: json["items"][i]["snippet"]["title"],
                            id: json["items"][i]["snippet"]["resourceId"]["channelId"],
                            thumbnail: json["items"][i]["snippet"]["thumbnails"]["default"]["url"]
                        }
                        tab.push(channel);
                    }
                    return ({ tab: tab, nextPageToken: nextPageToken });
                }
                else {
                    console.log("error: ", json);
                    return (null);
                }
            })
        return (tab);
    }

    async getAllSubscription(token) {
        var tab = [];
        var value = await getSubscription(token, "");
        if (value != null) {
            for (var i = 0; i < value.tab.length; i++)
                tab.push(value.tab[i])
            while (value.nextPageToken != undefined) {
                var value = await getSubscription(token, value.nextPageToken);
                if (value != null) {
                    for (var i = 0; i < value.tab.length; i++)
                        tab.push(value.tab[i])
                }
                else
                    return (null)
            }
        }
        else
            return (null);
        return (tab);
    }

    async addVideo(json) {
        var videoId = await this.getNewVideo(this.param[3])
        var id = json["id"];
        var tab = await fetch("https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + this.token,
            },
            body: JSON.stringify({
                "snippet": {
                    "playlistId": id,
                    "position": 0,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": videoId.id
                    }
                }
            })
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json();
                    return (json)
                }
                else {
                    var json = await response.json();
                    return (json)
                }
            })
        return (tab)
    }

    async addVideoToWatchLater() {
        var tab = await fetch("https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true", {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + this.token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json()
                    for (var i = 0; i < json["items"].length; i++) {
                        if (json["items"][i]["snippet"]["title"] === this.param[1]) {
                            return (await this.addVideo(json["items"][i]))
                        }
                    }
                }
                else {
                    var json = await response.json()
                    console.log("problem: ", json);
                    return (null)
                }
                return (null)
            })
        return (tab)
    }

    async getNewVideo(channelId) {
        var tab = await fetch("https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=" + channelId, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + this.token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    var res = await response.json();
                    var uploadId = res["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"];
                    var answer = await fetch("https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=1&playlistId=" + uploadId, {
                        method: "GET",
                        headers: {
                            'Authorization': 'Bearer ' + this.token,
                        }
                    })
                        .then(async ans => {
                            var lastestVideo = await ans.json();
                            // console.log("latest video", lastestVideo["items"][0]["snippet"]["title"])
                            return ({
                                channelTitle: lastestVideo["items"][0]["snippet"]["channelTitle"],
                                name: lastestVideo["items"][0]["snippet"]["title"],
                                id: lastestVideo["items"][0]["contentDetails"]["videoId"]
                            })
                        })
                }
                else {
                    var json = await response.json()
                    console.log("problem: ", json);
                    return (null)
                }
                return (answer)
            })
        return (tab)
    }
}

module.exports = Google