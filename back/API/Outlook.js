const User = require('../models/user')
const fetch = require('node-fetch');
const FormData = require('form-data');
const Weather = require ('./Meteo')

require("../passport/passport");


const OUTLOOK_CLIENT_ID = "17b92ba4-e055-4e20-a59c-eef5640371fe"
const OUTLOOK_CLIENT_SECRET = "8i435u-YJ5A8efWf3zzq_H_73H_Z9~u~3k"

class Outlook {
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

    async initialize() {
        var res = await this.getInboxMail()
        if (res === null) {
            var value = await this.refreshAccessToken();
            console.log("refresh outlook token");
            this.setToken = value;
        }
    }

    async areaFunc() {
        if (this.param[0] === "asUnreadEmail")
            return (await this.asUnreadEmail());
        if (this.param[0] === "createEvent")
            return (await this.createEvent())
        if (this.param[0] === "sendEmail")
            return (await this.sendEmail())
        if (this.param[0] === "isEvent")
        return (await this.isEvent())
        if (this.param[0] === "getEmailFolder")
            console.log("unreadEmail");
        return ("unknown");
    }

    async getInboxMail() {
        var tab = await fetch('https://outlook.office.com/api/v2.0/me/mailfolders/inbox/messages?$top=10', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token,
            }
        })
            .then(async response => {
                // console.log("response = ", response)
                if (response.status === 200) {
                    var json = await response.json()
                    return (json);
                }
                else
                    return (null);
            })
        return (tab)
    }

    async refreshAccessToken() {
        const form = new FormData();
        form.append("grant_type", "refresh_token");
        form.append('refresh_token', this.refreshToken);
        form.append("client_id", OUTLOOK_CLIENT_ID);
        form.append("redirect_uri", "http://localhost:8080");
        form.append("client_secret", OUTLOOK_CLIENT_SECRET);
        var tab = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
            method: "POST",
            headers: {
                'Content_Type': "application/x-www-form-urlencoded",
                'client_id': OUTLOOK_CLIENT_ID,
                'scope': 'profile, offline_access, https://outlook.office.com/Mail.ReadWrite, https://outlook.office.com/calendars.readwrite',
                'redirect_uri': "http://localhost:8080",
                'grant_type': "refresh_token",
                'client_secret': OUTLOOK_CLIENT_SECRET,
                'refresh_token': this.token,
            },
            body: form
        })
            .then(async response => {
                var json = await response.json()
                if (json["token_type"] !== undefined) {
                    this.token = json.access_token;
                    User.findOneAndUpdate({ "_id": this.userId, "tokenList.service": "outlook" },
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

    getDateTime(time, start) {
        if (time === "night") {
            var date = new Date();
            if (start === 1)
                date.setHours(19, 0, 0, 0);
            else
                date.setHours(20, 0, 0, 0);
            return (date.toISOString());
        }
        else {
            return (time);
        }
    }

    async createEvent() {
        var subject = this.param[1];
        //var content = this.param[2];
        var startDatetime = this.getDateTime(this.param[2], 1)
        var endDatetime = this.getDateTime(this.param[3], 0)
        var tab = await fetch('https://outlook.office.com/api/v2.0/me/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': "Bearer " + this.token,
            },
            body: JSON.stringify({
                "Subject": subject,
                "Body": {
                    "ContentType": "HTML",
                    "Content": ""
                },
                "Start": {
                    "DateTime": startDatetime,
                    "TimeZone": "Pacific Standard Time"
                },
                "End": {
                    "DateTime": endDatetime,
                    "TimeZone": "Pacific Standard Time"
                },
                "Attendees": [
                    {
                        "EmailAddress": {
                            "Address": this.email,
                            "Name": this.username
                        },
                        "Type": "Required"
                    }
                ]
            })
        })
            .then(async response => {
                if (response.status === 201)
                    return ("success")
                else
                    return ("failure");
            })
        return (tab);
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
        var email = this.param[1];
        var subject = this.param[2];
        var content = await this.getContent();
        console.log(content);
        var tab = await fetch('https://outlook.office.com/api/v2.0/me/sendmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': "Bearer " + this.token,
            },
            body: JSON.stringify({
                "Message": {
                    "Subject": subject,
                    "Body": {
                        "ContentType": "Text",
                        "Content": content
                    },
                    "ToRecipients": [
                        {
                            "EmailAddress": {
                                "Address": email
                            }
                        }
                    ]
                },
                "SaveToSentItems": "false"
            })
        })
            .then(async response => {
                if (response.status == 202)
                    return ("success")
                else {
                    var json = await response.json();
                    console.log(json);
                    return ("failure");
                }
            })
        return (tab)
    }

    async getEvent(daysNb) {
        let date = new Date()
        let next = new Date()

        var lastday = date.getDate() + daysNb;
        var nextWeek = new Date(next.setDate(lastday));

        console.log(date)
        var tab = await fetch('https://outlook.office.com/api/v2.0/me/calendarview?startDateTime=' + date.toISOString() + '&endDateTime=' + nextWeek.toISOString() + '&$select=Subject,Organizer,Start,End', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token,
            },
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json()
                    var tab = "";
                    for (var i = 0; i < json["value"].length; i++) {
                        tab += "Event at " + json["value"][i]["Start"]["DateTime"]
                        tab += " finish at " + json["value"][i]["End"]["DateTime"]
                        tab += ". Subject " + json["value"][i]["Subject"]
                        tab += ". Organized by " + json["value"][i]["Organizer"]["EmailAddress"]["Address"]
                        tab += "\n"
                    }
                    return (tab)
                }
                else {
                    return (null);
                }
            })
        return (tab)
    }

    async isEvent() {
        let date = new Date()
        let next = new Date()

        var lastday = date.getDate() + parseInt(this.param[1]);
        var nextWeek = new Date(next.setDate(lastday));

        var tab = await fetch('https://outlook.office.com/api/v2.0/me/calendarview?startDateTime=' + date.toISOString() + '&endDateTime=' + nextWeek.toISOString() + '&$select=Subject,Organizer,Start,End', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token,
            },
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json()
                    var tab = "";
                    for (var i = 0; i < json["value"].length; i++) {
                        tab += "Event at " + json["value"][i]["Start"]["DateTime"]
                        tab += " finish at " + json["value"][i]["End"]["DateTime"]
                        tab += ". Subject " + json["value"][i]["Subject"]
                        tab += ". Organized by " + json["value"][i]["Organizer"]["EmailAddress"]["Address"]
                        tab += "\n"
                    }
                    return (tab)
                }
                else {
                    return (null);
                }
            })
        return (tab)
    }

    checkUnreadEmail(json) {
        if (this.param.length != 2) {
            if (this.param[2] === "from") {
                if (this.param[3] === json["Sender"]["EmailAddress"]["Address"]) {
                    // console.log("from outlook");
                    return (true)
                }
            }
            if (this.param[2] === "subject") {
                if (this.param[3] === json["Subject"]) {
                    // console.log("subject outlook");
                    return (true)
                }
            }
            return (false);
        }
        return (true)
    }

    async asUnreadEmail() {
        // console.log(this.token);
        var folder = this.param[1];
        var tab = await fetch('https://outlook.office.com/api/v2.0/me/mailfolders/' + folder + '/messages?$top=5', {
            method: 'GET',
            headers: {
                'Content-Type': 'x-www-form-urlencoded',
                'Authorization': "Bearer " + this.token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json()
                    var d1 = new Date();
                    var tab = null
                    for (var i = 0; i < json["value"].length; i++) {
                        if (json["value"][i]["IsRead"] == false
                            && this.checkUnreadEmail(json["value"][i]) == true) {
                            tab = {
                                id: json["value"][i]["Id"],
                                subject: json["value"][i]["Subject"],
                                from: json["value"][i]["Sender"]["EmailAddress"]["Address"]
                            }
                            return (tab);
                        }
                    }
                    return tab
                }
                else
                    return (null);
            })
        return (tab)
    }

    async getEmailFolder() {
        var tab = await fetch('https://outlook.office.com/api/v2.0/me/MailFolders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token,
            }
        })
            .then(async response => {
                if (response.status === 200) {
                    var json = await response.json()
                    console.log(json)
                    var tab = []
                    for (var i = 0; i < json["value"].length; i++) {
                        tab.push({ displayName: json["value"][i].DisplayName, Id: json["value"][i].Id })
                    }
                    return (tab)
                }
                else
                    return (null)
            })
        return (tab)
    }
}

module.exports = Outlook