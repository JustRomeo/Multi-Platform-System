const fetch = require("node-fetch");

const pseudo = "JustRomeo";

async function functiontest(link) {
    var reponse = await fetch(link);

    if (reponse.status == 200)
        return await reponse.json();
    return null;
}

class Github {
  
    getProfile(username) {return functiontest('https://api.github.com/users/' + username).then(function(data) {return data});}
    getNames(username) {
        let link = 'https://api.github.com/users/' + username + '/repos'
        let resp = functiontest(link).then(function(data) {
            let liste = []

            for (let i = 0; i < data.length; i ++)
                liste.push({"row": i, "name": data[i].name, "language": data[i].language, "public": data[i].private});
            return liste
        })

        return resp
    }
}

new Github().getProfile("JustRomeo").then(function(data) {console.log(data)})
new Github().getNames("JustRomeo").then(function(data) {
    for (let i = 0; i < data.length; i ++)
        console.log(data[i]);
})
