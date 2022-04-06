const fetch = require("node-fetch");

function getHostStatus(link) {
    return fetch(link).then(function(response) {return response.status;}).then (function(data) {return data}).catch(function(error) {console.log(error);});
}

getHostStatus("https://google.com").then(function(data) {
    console.log(data);
})
