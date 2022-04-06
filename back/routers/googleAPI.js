const express = require('express');
const User = require('../models/user')
const controller = require("../passport/UserController");
const passport = require('passport');
const fetch = require('node-fetch');
const FormData = require('form-data');
const Base64 = require('js-base64');
const googleRouter = express.Router();

require("../passport/passport");

const GOOGLE_CLIENT_ID = "376944395458-29cfekb0if15npp10sdrpdv6hk4glukv.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "HbJPo99YNOdA3CM4II2EI6QK"

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

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

function mailHeaderParser(mail, index) {
  for (var i = 0; i < mail["payload"]["headers"].length; i++) {
    if (mail["payload"]["headers"][i]["name"] === index) {
      return (mail["payload"]["headers"][i]["value"]);
    }
  }
  return "";
}

async function getUserUnreadEmail(email, token) {
  tab = await fetch('https://gmail.googleapis.com/gmail/v1/users/' + email + '/messages?includeSpamTrash=false&maxResults=5&access_token=' + token, {
    method: 'GET',
  })
    .then(async response => {
      var json = await response.json();
      if (json["error"] === undefined) {
        var d1 = new Date();
        for (var i = 0; i < json["messages"].length; i++) {
          var id = json["messages"][i]['id']
          var tab = await fetch('https://gmail.googleapis.com/gmail/v1/users/' + email + '/messages/' + id + '?access_token=' + token, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(async response => {
              var json = await response.json()
              var time = Date.parse(mailHeaderParser(json, "Date"))
              var diff = Math.abs(time - Date.parse(d1))
              var minDiff = Math.floor((diff / 1000) / 60)
              if (minDiff < 10 && (json["labelIds"][0] === "UNREAD" || json["labelIds"][1] === "UNREAD")) {
                var tab = {
                  subject: mailHeaderParser(json, "Subject"),
                  from: mailHeaderParser(json, "From")
                }
                return (tab)
              }
            })
          if (tab != undefined)
            return (tab)
        }
      }
      else
        return ("error");
    })
  return (tab)
}

async function sendEmail(user, token, body) {
  console.log(body.email, user.email)
  let req = ["to: ", body.email, "\n",
    "from: ", user.email, "\n",
    "subject: ", body.subject, "\n\n",
    body.content].join('')
  var encoded = Base64.encode(req);
  console.log(encoded)
  var tab = await fetch('https://gmail.googleapis.com/gmail/v1/users/' + user.email + '/messages/send', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      "Content-Type": "message/rfc822",
      'Authorization': 'Bearer ' + token,
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
}

async function getCalendar(user, token) {
  let date = new Date()
  var d1 = new Date().toISOString();
  var lastday = date.getDate() + 7;
  var nextWeek = new Date(date.setDate(lastday)).toISOString();
  var tab = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMax=' + nextWeek + '&timeMin=' + d1, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
    .then(async response => {
      if (response.status === 200) {
        var json = await response.json();
        console.log(json);
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

async function createEvent(token, startTime, endTime, subject) {
  var tab = fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      "end": {
        "dateTime": endTime
      },
      "start": {
        "dateTime": startTime
      },
      "summary": subject
    })
  })
    .then(async response => {
      if (response.status === 200) {
        var json = await response.json();
        return (json);
      }
      else
        return (null);
    })
  return (tab);
}

async function refreshToken(token, user) {
  const form = new FormData();
  form.append("grant_type", "refresh_token");
  form.append('refresh_token', token);
  form.append("client_id", GOOGLE_CLIENT_ID);
  form.append("scope", "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly")
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
      console.log(json);
      if (json["token_type"] !== undefined) {
        var result = User.findOneAndUpdate({ "email": user.email, "tokenList.service": "google" },
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

async function getSubscription(token, nextPageToken) {
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

async function getAllSubscription(token) {
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

async function addVideo(json, videoID, token) {
  var id = json["id"];
  // console.log(json)
  var tab = await fetch("https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet", {
    method: "POST",
    headers: {
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      "snippet": {
        "playlistId": id,
        "position": 0,
        "resourceId": {
          "kind": "youtube#video",
          "videoId": videoID
        }
      }
    })
  })
  .then(async response => {
    // console.log(response);
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

async function addVideoToWatchLater(token, playlist, videoID) {
  var tab = await fetch("https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true", {
    method: "GET",
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
    .then(async response => {
      if (response.status === 200) {
        var json = await response.json()
        for (var i = 0; i < json["items"].length; i++) {
          if (json["items"][i]["snippet"]["title"] === playlist) {
            return (await addVideo(json["items"][i], videoID, token))
          }
        }
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

async function getNewVideo(token, channelId) {
  var tab = await fetch("https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=" + channelId, {
    method: "GET",
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
    .then(async response => {
      if (response.status === 200) {
        var res = await response.json();
        var uploadId = res["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"];
        var answer = await fetch("https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=1&playlistId=" + uploadId, {
          method: "GET",
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        })
          .then(async ans => {
            var lastestVideo = await ans.json();
            console.log(lastestVideo["items"][0]["contentDetails"]["videoId"])
            return ({
              channelTitle: lastestVideo["items"][0]["snippet"]["channelTitle"],
              name: lastestVideo["items"][0]["snippet"]["title"],
              id: lastestVideo["items"][0]["contentDetails"]["videoId"]
            })
          })
      }
      else {
        console.log("problem: ", response);
        return (null)
      }
      return (answer)
    })
  return (tab)
}

googleRouter.get("/addVideoToWatchLater", passport.authenticate("jwt", { session: false }), async (req, res) => {
  var token = getTokenfromUser("google", req.user);
  const tab = await addVideoToWatchLater(token.access_token, req.body.playlist, req.body.id);
  console.log(tab);
  res.status(200).json(tab)
})

googleRouter.get("/latestVideo", passport.authenticate("jwt", { session: false }), async (req, res) => {
  var token = getTokenfromUser("google", req.user);
  const tab = await getNewVideo(token.access_token, req.body.id);
  console.log(tab);
  res.status(200).json(tab)
})

googleRouter.get("/getAllSubscription", passport.authenticate("jwt", { session: false }), async (req, res) => {
  var token = getTokenfromUser("google", req.user);
  var newToken = await refreshToken(token.refresh_token, req.user);
  console.log(newToken);
  var tab = [];
  if (newToken != null)
    tab = await getAllSubscription(newToken);
  else
    tab = await getAllSubscription(token.access_token);
  // console.log(tab);
  res.status(200).json(tab)
})

googleRouter.post('/sendEmail', passport.authenticate("jwt", { session: false }), async (req, res) => {
  var token = getTokenfromUser("google", req.user);
  const tab = await sendEmail(req.user, token.access_token, req.body);
  console.log(tab);
  res.status(200).json(tab)
})

googleRouter.get('/getUserUnreadEmail', passport.authenticate("jwt", { session: false }), async (req, res) => {
  var token = getTokenfromUser("google", req.user);
  const tab = await getUserUnreadEmail(req.user.email, token.access_token)
  console.log(tab);
  res.status(200).json(tab)
})

googleRouter.get('/getCalendar', passport.authenticate("jwt", { session: false }), async (req, res) => {
  var token = getTokenfromUser("google", req.user);
  const tab = await getCalendar(req.user.email, token.access_token)
  console.log(tab);
  res.status(200).json(tab)
})

googleRouter.post('/createEvent', passport.authenticate("jwt", { session: false }), async (req, res) => {
  var token = getTokenfromUser("google", req.user);
  const tab = await createEvent(token.access_token, "2021-02-11T10:30:00Z", "2021-02-11T11:30:00Z", "test create event")
  console.log(tab);
  res.status(200).json(tab)
})

googleRouter.post('/refreshToken', passport.authenticate("jwt", { session: false }), async (req, res) => {
  var token = getTokenfromUser("google", req.user);
  const tab = await refreshToken(token.refresh_token, req.user)
  console.log(tab);
  res.status(200).json(tab)
})

module.exports = googleRouter;
