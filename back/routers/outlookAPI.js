const express = require('express');
const User = require('../models/user')
const controller = require("../passport/UserController");
const passport = require('passport');
const fetch = require('node-fetch');
const FormData = require('form-data');
// const { jobs } = require('googleapis/build/src/apis/jobs');
// const { create } = require('../models/user');

const outlookRouter = express.Router();

require("../passport/passport");


const OUTLOOK_CLIENT_ID = "17b92ba4-e055-4e20-a59c-eef5640371fe"
const OUTLOOK_CLIENT_SECRET = "8i435u-YJ5A8efWf3zzq_H_73H_Z9~u~3k"

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

//get last 10 mail in inbox folder
outlookRouter.get('/getUserEmail', passport.authenticate("jwt", { session: false }), async (req, res) => {
    fetch('https://outlook.office.com/api/v2.0/me/mailfolders/inbox/messages?$top=10', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + req.user.tokenList[0].token,
            'User-Agent': "PlayGroundAgent/1.0",
            'client-request-id': req.user.password
        }
    })
        .then(response => response.json())
        .then(json => res.status(200).json(json))
})

async function getUserInfo(token) {
    var tab = await fetch('https://outlook.office.com/api/v2.0/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        }
    })
        .then(response => response.json())
        .then(json => {
            return (json)
        })
    return (tab);
}

async function getUserEmailFolder(token) {
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


async function asUnreadEmail(folder, token) {
    tab = await fetch('https://outlook.office.com/api/v2.0/me/mailfolders/' + folder + '/messages?$top=10', {
        method: 'GET',
        headers: {
            'Content-Type': 'x-www-form-urlencoded',
            'Authorization': "Bearer " + token,
        }
    })
        .then(async response => {
            if (response.status === 200) {
                var json = await response.json()
                var d1 = new Date();
                var tab = null
                var value = null
                for (var i = 0; i < json["value"].length; i++) {
                    if (json["value"][i]["IsRead"] == false) {
                        tab = {
                            id: json["value"][i]["Id"],
                            subject: json["value"][i]["Subject"],
                            from: json["value"][i]["Sender"]["EmailAddress"]["Address"]
                        }
                        return (tab)
                    }
                }
                return value
            }
            else
                return (null);
        })
    return (tab)
}

async function getEvent(token) {
    let date = new Date()
    let next = new Date()

    var lastday = date.getDate() + 7;
    var nextWeek = new Date(next.setDate(lastday));

    console.log(date)
    var tab = await fetch('https://outlook.office.com/api/v2.0/me/calendarview?startDateTime=' + date.toISOString() + '&endDateTime=' + nextWeek.toISOString() + '&$select=Subject,Organizer,Start,End', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        },
    })
        .then(async response => {
            console.log(response)
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

async function sendMail(subject, content, email, token) {
    var tab = await fetch('https://outlook.office.com/api/v2.0/me/sendmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': "Bearer " + token,
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
        .then(response => {
            if (response.status == 202)
                return ("success")
            else
                return ("failure");
        })
    return (tab)
}

async function createEvent(body, user, token) {
    var tab = await fetch('https://outlook.office.com/api/v2.0/me/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': "Bearer " + token,
        },
        body: JSON.stringify({
            "Subject": body.subject,
            "Body": {
                "ContentType": "HTML",
                "Content": body.content
            },
            "Start": {
                "DateTime": body.startDatetime,
                "TimeZone": "Pacific Standard Time"
            },
            "End": {
                "DateTime": body.endDatetime,
                "TimeZone": "Pacific Standard Time"
            },
            "Attendees": [
                {
                    "EmailAddress": {
                        "Address": user.email,
                        "Name": user.username
                    },
                    "Type": "Required"
                }
            ]
        })
    })
        .then(response => {
            if (response.status === 201)
                return ("success")
            else
                return ("failure");
        })
    return (tab);
}

async function refreshToken(token, user) {
    const form = new FormData();
    form.append("grant_type", "refresh_token");
    form.append('refresh_token', token);
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
            'refresh_token': token,
        },
        body: form
    })
        .then(async response => {
            var json = await response.json()
            if (json["token_type"] !== undefined) {
                console.log(json)
                var result = User.findOneAndUpdate({ "email": user.email, "tokenList.service": "outlook" },
                    { $set: { "tokenList.$.token": json.access_token } }, function (error, success) {
                        if (error)
                            return ("error")
                        else
                            return ("success")
                    })
                return (result);
            }
            else {
                return ("failure");
            }
        })
    return (tab)
}

//get all folder in user mailbox
outlookRouter.get('/getUserEmailFolder', passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("outlook", req.user);
    var tab = await getUserEmailFolder(token.access_token)
    console.log(tab)
    res.status(200).json(tab)
})

//check if user has unread email and send object and and sender as response
outlookRouter.get("/asUnreadEmail", passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("google", req.user);
    var tab = await asUnreadEmail("inbox", token.access_token)
    console.log(tab)
    res.status(200).json(tab)
})


//get all event for the next 7 days
outlookRouter.get("/getUser", passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("outlook", req.user);
    var tab = await getUserInfo(token.access_token);
    console.log(tab)
    res.status(200).json(tab)
})

outlookRouter.get("/getEvent", passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("outlook", req.user);
    var tab = await getEvent(token.access_token);
    console.log(tab)
    res.status(200).json(tab)
})

//send email
outlookRouter.post('/sendEmail', passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("outlook", req.user);
    var tab = await sendMail(req.body.subject, req.body.content, req.body.email, token.access_token);
    console.log(tab)
    res.status(200).json(tab)
})

outlookRouter.post('/createEvent', passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("outlook", req.user);
    var tab = await createEvent(req.body, req.user, token.access_token)
    console.log(tab)
    res.status(200).json(tab)
})

outlookRouter.post('/refreshToken', passport.authenticate("jwt", { session: false }), async (req, res) => {
    var token = getTokenfromUser("outlook", req.user);
    var tab = await refreshToken(token.refresh_token, req.user)
    console.log(tab);
    res.status(200).json(tab);
})

module.exports = outlookRouter