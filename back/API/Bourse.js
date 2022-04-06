const fetch = require("node-fetch");

const ApiKey = "cf0976650df462658738"

class Bourse {
    param = "";

    constructor(actionParameter) {
        this.param = actionParameter;
    }

    async areaFunc() {
        if (this.param[0] === "isCurrencyUnder") {
            return (this.isCurrencyUnder());
        }
    }

    async isCurrencyUnder() {
        var link = "https://free.currconv.com/api/v7/convert?q=" + src + "_" + this.param[1] + "&compact=ultra&apiKey=" + ApiKey;
        var request = await fetch(link);

        if (request.status === 200) {
            var json = await request.json();
            var value = Object.values(json)[0]
            if (value < parseInt(this.param[2])) {
                console.log("here");
                return (Object.values(json)[0])
            }
            return (null)
        }
        return(null)
    }

    async isCurrencyOver() {
        var link = "https://free.currconv.com/api/v7/convert?q=" + src + "_" + dest + "&compact=ultra&apiKey=" + ApiKey;
        var request = await fetch(link);

        if (request.status === 200) {
            var json = await request.json();
            var value = Object.values(json)[0]
            if (value > parseInt(this.param[2])) {
                console.log("here");
                return (Object.values(json)[0])
            }
            return (null)
        }
        return(null)
    }

    getConverter(src, dest, number = 1) {
        var link = "https://free.currconv.com/api/v7/convert?q=" + src + "_" + dest + "&compact=ultra&apiKey=" + ApiKey;
        var request = fetch(link).then(function (response) {return response.json()});

        return request.then(function (data) {return number * Object.values(data)[0]}).catch(function (error) {console.log(error);});
    }
}

var test = 1
var src = "USD"
var dest = "EUR"

// var bourse = new Bourse(["isCurrencyUnder", "USD", "EUR"])
// var result = bourse.areaFunc()
// console.log(bourse.isCurrencyUnder())

module.exports = Bourse;