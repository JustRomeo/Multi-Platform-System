const fetch = require("node-fetch");

var cityone = "Paris";
var APIKEY = "5022ca1b0125aca8cc60906125fc45ba"

const link = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityone + '&units=metric&lang=fr&appid=' + APIKEY
// console.log(link)
// console.log("");

async function functiontest(link) {
    var reponse = await fetch(link);

    if (reponse.status == 200) {
        // console.log(await reponse.json());
        return await reponse.json();
    }
    return null;
}

class Weather {
    param = "";

    constructor(actionParameter) {
        this.param = actionParameter;
    }

    async areaFunc() {
        if (this.param[0] === "isTempUnder") {
            return (await this.isTempUnder());
        }
    }

    async getWeather(city) {
        var request ='https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&lang=fr&appid=' + APIKEY
        var result = await functiontest(request)
        if (result === null)
            return (null)
        var tab = "weather in " + city + ": "
        tab += result.weather[0].main + ", temp: " + result.main.temp + "\n";
        tab += "Humidity : " + result.main.humidity + " wind : " + result.wind.speed
        console.log("weather = ", tab)
        return tab;
    }

    async getTemp() {
        var request ='https://api.openweathermap.org/data/2.5/weather?q=' + this.param[1] + '&units=metric&lang=fr&appid=' + APIKEY
        var result = await functiontest(request)
        if (result === null)
            return (null)
        var tab = "weather in " + this.param[1] + ": "
        tab += result.weather[0].main + ", temp: " + result.main.temp + "\n";
        tab += "Humidity : " + result.main.humidity + " wind : " + result.wind.speed
        console.log(tab)
        return tab;
    }
    async isTempUnder() {
        var request ='https://api.openweathermap.org/data/2.5/weather?q=' + this.param[1] + '&units=metric&lang=fr&appid=' + APIKEY
        var result = await functiontest(request)
        if (result === null)
            return (null)
        if (result.main.temp < parseInt(this.param[2]))
            return result.main.temp;
        return (null);
    }
    // getSunset() { return functiontest(link).then(function (data) { return data.sys.sunset }).catch(function (error) { console.log(error); }); }
    // getSunrise() { return functiontest(link).then(function (data) { return data.sys.sunrise }).catch(function (error) { console.log(error); }); }
    // getPressure() { return functiontest(link).then(function (data) { return data.main.pressure }).catch(function (error) { console.log(error); }); }
    // getHumidity() { return functiontest(link).then(function (data) { return data.main.humidity }).catch(function (error) { console.log(error); }); }
    // getTempFeel() { return functiontest(link).then(function (data) { return data.main.feels_like }).catch(function (error) { console.log(error); }); }
    // getWeather() { return functiontest(link).then(function (data) { return data.weather[0].description }).catch(function (error) { console.log(error); }); }
}
// var weather = new Weather(["isTempUnder", "Paris"])

// weather.getTemp()

module.exports = Weather

// new Weather().getTemp().then(function (data) { console.log("Temperature:", data + "°C"); });
// new Weather().getTempFeel().then(function (data) { console.log("Ressenti:", data + "°C"); });
// new Weather().getPressure().then(function (data) { console.log("Pressure:", data); });
// new Weather().getHumidity().then(function (data) { console.log("Humidity:", data + "%"); });
// new Weather().getWeather().then(function (data) { console.log("Weather:", data); });
// new Weather().getSunrise().then(function (data) { console.log("Sunrise:", data); });
// new Weather().getSunset().then(function (data) { console.log("Sunset:", data); });

