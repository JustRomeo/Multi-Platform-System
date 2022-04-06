//var apiKey = "vsnW8WIfZXV6F624IaQ8VKrG3"
//var secretKey = "rvTOfcF58YOWBkrVvgJukPBd4IQwee3Tg3mplLyHYmKBuNvqBO"

//var accessToken = "754748945142865920-ojrOu6X02ViMUr147ZTfJ25T8JYY9O8"
//var accessSecretToken = "8fx3TeGlmBVhO3CKgRPXyi3Uzrl5F3FbDFae0LdZlgbVt"



const fetch = require("node-fetch");

var bearerToken = "Bearer AAAAAAAAAAAAAAAAAAAAALjNLwEAAAAAZSqmnqpmrMMdYvUUWT9ZSYwN%2Fuc%3D4aTo6zt41YhLMXDzQDlpFKQkZBkmD1ok36w40Vt6UE4w4o44qn"

function request(method_used, link, params) {
    fetch(link + params, {
        method: method_used,
        headers: {'Authorization': bearerToken, 'Content-Type': 'application/json'}
    }).then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err))
}

class Twitter {
    getSearchTwitter(text) {
        console.log("start");

        var link = "https://api.twitter.com/2/tweets/search/recent";

        console.log(link);

        request('GET', link, "?query=" + text)

        console.log("end");
    }
}

var twitter = new Twitter()
twitter.getSearchTwitter("from:Epitech")