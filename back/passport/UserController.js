const User = require('../models/user')
const generateJWT = require("./generateJWT");
const Epitech = require("../API/Epitech");
const bcrypt = require('bcrypt');

GOOGLE_REFRESH_TOKEN = "1//03MmtNb2dve6hCgYIARAAGAMSNwF-L9IrjL000ZIfkYNqwrYvR0cbMNmLNiRVHz9T6QHEyMoBC1qo5q6jNTpFL8EkZ0S57NdBM7A"
OUTLOOK_REFRESH_TOKEN = "0.AAAAyrQckGK4KUCTBuXND22fhqQruRdV4CBOpZzu9WQDcf50AJ0.AgABAAAAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P_qEZwOfLbhIOjK_uXWQZy-euWdqQCs5n-sN1nxDOUigRIbAVVKyHiR3YJHqEBSKoCG5KeHNFYcrHulVN54EPkIe5BNkasTjRKXgZJrq6wSmxf1owtY6s5tpFU4gb69wlSWFXeYDQBelSsD3nG0XA6hqkOwfMzGagGz6Y86t4m_qJN_vuTLe3Z2pkYaYMi2vzGIxKQ3czsibyyxfa0c64olYF3_ZYfmacugZt-VvRnXHbS182y7LW922TDc0R379giQrOGc4WBVxTZoEjbPQk4Sv-8Th99AnuLL5s-AGAS0VsiyrKUiVWs1elh-Ue2pDqTC1U8d9kufJeEBtfYe4fX8mac19-UPvnnLL2aHvSiq7rLwYffjkDNoW_trnaTgYa0PLCQ4haPkMthrImJ6AZTfU1vxzMfYBqniSxuhDLD4d_miLxiHEnPZs5IcA3S6kV3d31DFSY3Nzwvs44Bda8HMhPbYUsBCGZJHRYsBV0mN6bwN8u1TleeQCV9IuvNZuTPanczmQskjjauDglY2M3q4eCbqnTpHckT_7-nzs0x2YEwYjEV6pPEL95fiDnQzUMxJl3GBBAMigQTOHPgNRtUNUYllEdBmVpDIMZcLFszLvwKOqAQoetjV--2-BSTGk6NyG2wSUHkzgKdwnxpxUliGip0jZVmopwaIgQlU73OuGXGy3Ax1aTyTWolNFmIuDwJemFUZFbWTQsR1r73kYPtXenGciRbsFiAqSvtzlW21i-pHCcOIrpSsVEdjv2WAC_3XSWoLGP-m4WXm1ATE4s9GVPoic5A_wCM-d4gdx0Ya53eGBs2GqQybAt27GSIUo42dPX-0BfF2To5hL4vEG_PfyfWdcL6TkHajKBEDVy-CFaWBFoZVMMTFk1Fs_yLaalM7DASphhBwWv0pveI__HUL3MHb0RXrTgOgos3Mlwg096T0rOWMHV1U0NvcbqsgubfxPclo6G0UpYVhz1eJHjjZNN5-QMAbYYzDkWQkIlcX0N_G3Sp4ywdhcgP9FIOhRZJd48iSVsXz307ToUFX3ppAfVDrhicZfqUs4aXjV7OJf0XJyGVVpByAx7wH091sldLlUXxchRogvMMQhkj_WpZiAnA_-6JbQvHJleD-6E_MTYHiC7FRk9VO-AMq5ltoH4kr9QXCxcy7KdPb4IwQ"
SPOTIFY_REFRESH_TOKEN = "AQCA8P7MY6rOmJJ1ztYujSc8RZR86hPNHXzLfds7Y1y1jH9wXK7dQI361Kj9bLDy07SUb4uTkXCNjql5fByBABIK-Fsqbs_I5SCPhZWdSJ13-7Q9pUvExT7DRzuJ9qh8I_0"
const encryptRound = 8;

exports.loginUser = async (req, res) => {
  User.findOne({ 'email': req.body.email }, 'username password email', async function (err, user) {
    if (err || !user) {
      res.status(404).end();
      return;
    }
    else {
      var cmp = await bcrypt.compare(req.body.password, user.password)
      if (cmp) {
        const jwt = generateJWT(user);
        console.log(jwt)
        res.status(201).json({
          user: user,
          token: jwt.token,
          expiresIn: jwt.expires,
        });
        return;
      }
      else {
        res.status(404).end();
        return;
      }
    }
  })
};

exports.addIntraToken = async (req, res) => {
  var newService = {
    service: "intra",
    token: req.body.token,
    email: req.body.email
  }
  var intra = new Epitech(req.user._id, newService.token, newService.email, req.user.username, "");
  var checkToken = await intra.getEpitech();
  console.log(checkToken);
  if (checkToken === null) {
    res.status(401).json("wrong token");
  }
  else {
    User.findOneAndUpdate({ '_id': req.user._id }, { $push: { tokenList: newService } }, function (err, success) {
      if (err) {
        console.log(err)
        res.status(401).json("can't add intra token");
        return;
      }
      else {
        console.log("success");
        res.status(200).json(success);
        return;
      }
    })
  }
}

exports.addGoogleToken = async (req, res) => {
  var newService = {
    service: "google",
    token: req.body.token,
    refreshToken: GOOGLE_REFRESH_TOKEN,
    email: req.body.email,
  }
  User.findOneAndUpdate({ '_id': req.user._id }, { $push: { tokenList: newService } }, function (err, success) {
    if (err) {
      console.log(err)
      res.status(404).end();
      return;
    }
    else {
      console.log("success");
      res.status(200).json(success);
      return;
    }
  })
}

exports.addSpotifyToken = async (req, res) => {
  var newService = {
    service: "spotify",
    token: req.body.token,
    refreshToken: req.body.refreshToken,
    email: req.body.email,
  }
  User.findOneAndUpdate({ '_id': req.user._id }, { $push: { tokenList: newService } }, function (err, success) {
    if (err) {
      console.log(err)
      res.status(404).end();
      return;
    }
    else {
      console.log("success");
      res.status(200).json(success);
      return;
    }
  })
}


exports.addOutlookToken = async (req, res) => {
  var newService = {
    service: "outlook",
    token: req.body.token,
    refreshToken: req.body.refreshToken,
    email: req.body.email,
  }
  User.findOneAndUpdate({ '_id': req.user._id }, { $push: { tokenList: newService } }, function (err, success) {
    if (err) {
      console.log(err)
      res.status(404).end();
      return;
    }
    else {
      console.log("success");
      res.status(200).json(success);
      return;
    }
  })
}

exports.addServiceToken = async (req, res) => {
  var newService = {};
  if (req.body.email === undefined) {
    newService = {
      service: req.body.service,
      token: req.body.token,
      refreshToken: req.body.refreshToken
    }
  }
  else {
    newService = {
      service: req.body.service,
      token: req.body.token,
      refreshToken: req.body.refreshToken,
      email: req.body.email
    }
  }
  User.findOneAndUpdate({ '_id': req.user._id }, { $push: { tokenList: newService } }, function (err, success) {
    if (err) {
      console.log(err)
      res.status(404).end();
      return;
    }
    else {
      console.log("success");
      res.status(200).json(success);
      return;
    }
  })
};

exports.removeServiceToken = async (req, res) => {
  User.findOneAndUpdate({ '_id': req.user._id }, { $pull: { 'tokenList': { service: req.body.service } } },
    function (err, success) {
      if (err) {
        console.log(err)
        res.status(404).end();
        return;
      }
      else {
        console.log("success");
        res.status(200).json("success");
        return;
      }
    })
};

exports.getServiceToken = async (req, res) => {
  User.findOne({ '_id': req.user._id }, 'tokenList', function (err, tokenList) {
    if (err || !tokenList) {
      res.status(404).end();
      return;
    }
    else {
      res.status(200).json(tokenList)
    }
  })
};


exports.getUserInfo = async (req, res) => {
  res.status(200).json(req.user);
};


exports.testLogged = async (req, res) => {
  console.log('success')
  res.status(200).end();
};
