const express = require('express');
const Area = require('../models/area')
// const constroller = require("../passport/UserController");
const passport = require('passport');

const areaRouter = express.Router();

require("../passport/passport");

areaRouter.post('/addAREA', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const area = new Area({
        userID: req.user._id,

        Action: req.body.actionService,
        ActionParameter: req.body.actionParameter,

        Reaction: req.body.reactionService,
        ReactionParameter: req.body.reactionParameter,
        data: ''
    })
    try {
        const newReaction = await area.save()
        res.status(201).json(newReaction)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

areaRouter.post("/removeArea", passport.authenticate("jwt", { session: false }), async (req, res) => {
    Area.findOneAndRemove({ '_id': req.body.id },
        function (err, success) {
            if (err) {
                res.status(400).end();
                return;
            }
            else {
                res.status(200).json("success");
                return;
            }
        })
})

areaRouter.post("/modifyArea", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const area = new Area({
        userID: req.user._id,

        Action: req.body.actionService,
        ActionParameter: req.body.actionParameter,

        Reaction: req.body.reactionService,
        ReactionParameter: req.body.reactionParameter,
        data: ''
    })
    Area.findOneAndUpdate({ '_id': req.body.id },
        {
            $set: {
                Action: area.Action,
                ActionParameter: area.ActionParameter,
                Reaction: area.Reaction,
                ReactionParameter: area.ReactionParameter,
            }
        },
        function (err, success) {
            if (err) {
                console.log(err)
                res.status(400).end();
                return;
            }
            else {
                res.status(200).json("success");
                return;
            }
        })
})

areaRouter.get("/getArea", passport.authenticate("jwt", { session: false }), async (req, res) => {
    Area.find({ '_id': req.body.id },
        function (err, area) {
            if (err || !area) {
                res.status(400).end();
                return;
            }
            else {
                res.status(200).json(area);
                return;
            }
        })
})

areaRouter.get("/getUserArea", passport.authenticate("jwt", { session: false }), async (req, res) => {
    Area.find({ 'userID': req.user._id },
        function (err, area) {
            if (err || !area) {
                res.status(400).end();
                return;
            }
            else {
                res.status(200).json(area);
                return;
            }
        })
})

module.exports = areaRouter;