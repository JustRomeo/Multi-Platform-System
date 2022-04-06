const fetch = require("node-fetch");

// const user = "TonytozorusRex.LaKipa@epitech.eu"
// const auth = "auth-a03496pf892l550cf04td94c23c0ef20bd880bb29"

const user = "alexandre.pereira@epitech.eu"
const auth = "auth-5d9d73ab8b58c44b948bba4ab5e078997e601a95"

async function makeRequest(link) {
    var reponse = await fetch(link);

    if (reponse.status == 200) {
        return await reponse.json();
    }
    return null;
}

class Epitech {
    userId = "";
    username = "";
    token = "";
    email = "";
    param = "";

    constructor(userId, token, email, username, actionParameter) {
        this.userId = userId;
        this.token = token;
        this.email = email;
        this.username = username;
        this.param = actionParameter
    }

    async areaFunc() {
        if (this.param[0] === "getGPA")
            return (await this.getGPA());
        if (this.param[0] === "getCredits")
            return (await this.getCredits());
        if (this.param[0] === "getMissed")
            return (await this.getMissed());
        if (this.param[0] === "getNotification")
            return (await this.getNotification());
        if (this.param[0] === "getEndProject")
            return (await this.getEndProject());
    }

    async getEpitech() {
        var link = "https://intra.epitech.eu/" + this.token + '/user/' + this.email + '?format=json';
        var reponse = await makeRequest(link);

        if (reponse == null)
            return (null);
        return (reponse);
    }

    async getNotification() {
        var link = "https://intra.epitech.eu/" + this.token + '/user/' + this.email + '/notification/message?format=json';
        var reponse = await makeRequest(link);

        if (reponse === null || reponse.length === 0)
            return (null)
        // console.log(reponse[1].id);
        return (reponse[0])
    }

    async getMissed() {
        var link = "https://intra.epitech.eu/" + this.token + '/user/' + this.email + '/notification/missed?format=json';
        var reponse = await makeRequest(link);

        // console.log(reponse);
        if (reponse === null || reponse.recents.length === 0)
            return (null)
        return (reponse.recents[0])
    }

    async getMark() {
        var link = "https://intra.epitech.eu/" + this.token + '/user/' + this.email + '/netsoul?format=json';
        var reponse = await makeRequest(link);

        console.log(reponse)
        return (reponse)
    }

    async checkEndOfProject(res) {
        var json = await res.json();
        for (var j = 0; j < json["activites"].length; j++) {
            if (json["activites"][j]["title"] === this.param[1]) {
                var end = json["activites"][j]["end"]
                var referenceDate = new Date();
                var date = new Date();
                var endDate = new Date(end);

                endDate.setHours(endDate.getHours() + (Math.abs(referenceDate.getTimezoneOffset()) / 60));
                date.setHours(date.getHours() + (Math.abs(referenceDate.getTimezoneOffset()) / 60));

                var diff = Math.abs((endDate - date) / (1000 * 60 * 60 * 24));

               return (Math.abs(diff))
            }
        }
        return (null)
    }

    //exemple of date before end of area Project : "2021-03-06T11:14:34.432Z"
    //exemple of date good for end of area Project : "2021-03-07T11:14:34.432Z"
    async getEndProject() {
        var user = await this.getEpitech();
        var link = "https://intra.epitech.eu/" + this.token + "/course/filter?format=json&preload=1&location=FR/PAR&course=bachelor/classic&scolaryear=2020";
        var response = await makeRequest(link);

        if (response === null)
            return (null)
        for (var i = 0; i < response.items.length; i++) {
            if (response.items[i].status === "ongoing") {
                var req = "https://intra.epitech.eu/" + this.token + "/module/" + response.items[i].scolaryear + '/' + response.items[i].code + '/' + response.items[i].codeinstance + '?format=json';
                var res = await fetch(req);
                if (res.status == 200) {
                    var endProject = await this.checkEndOfProject(res);
                    if (endProject != null) {
                        // console.log(response.items[i])
                        return (endProject);
                    }
                }
                else {
                    return (null)
                }
            }
        }
        return ("reponse")
    }

    getName() {
        var link = "https://intra.epitech.eu/" + this.token + '/user/' + this.email + '/?format=json';
        var reponse = makeRequest(link);

        if (reponse == null)
            return;
        return reponse.then(function (data) { return data.title; }).catch(function (error) { console.log(error); });
    }
    getPromo() {
        var link = "https://intra.epitech.eu/" + this.token + '/user/' + this.email + '/?format=json';
        var reponse = makeRequest(link);

        if (reponse == null)
            return;
        return reponse.then(function (data) { return data.promo; }).catch(function (error) { console.log(error); });
    }
    async getGPA() {
        var link = "https://intra.epitech.eu/" + this.token + '/user/' + this.email + '/?format=json';
        var reponse = await makeRequest(link);

        if (reponse == null)
            return (null);
        return reponse.gpa[0].gpa
    }
    async getCredits() {
        var link = "https://intra.epitech.eu/" + this.token + '/user/' + this.email + '/?format=json';
        var reponse = await makeRequest(link);

        if (reponse == null)
            return (null);
        return reponse.credits
    }
    getPicture() {
        var link = "https://intra.epitech.eu/" + this.token + '/user/' + this.email + '/?format=json';
        var reponse = makeRequest(link);

        if (reponse == null)
            return;
        return reponse.then(function (data) { return "https://intra.epitech.eu" + data.picture; }).catch(function (error) { console.log(error); });
    }
}

// new Epitech().getEpitech(user, auth)
// new Epitech().getName(user, auth).then(function (data) { console.log("Name: " + data) })
// new Epitech().getPromo(user, auth).then(function (data) { console.log("Promo: " + data) })
// new Epitech().getGPA(user, auth).then(function (data) { console.log("GPA: " + data) })
// new Epitech().getCredits(user, auth).then(function (data) { console.log("Credits: " + data) })
// new Epitech().getPicture(user, auth).then(function (data) { console.log("Picture: " + data) })

module.exports = Epitech