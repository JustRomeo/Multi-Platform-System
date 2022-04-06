const fetch = require("node-fetch");

var APIKEY = "54ad01a8752824dd50aa35a0b1e0349f"

class Deezer {
    timetostr(string) {
        var toint = parseInt(string);
        var min = parseInt(toint / 60);
        var sec = (toint / 60 - min) * 100;
    
        sec = parseInt(sec / 100 * 60);
    
        return String(min) + ":" + String(sec);
    }
    getFetch(link) {
        var lf = fetch(link).then(function(response) {
            return response.json();
        }).then (function(data) {
            return data
        }).catch(function(error) {
            console.log(error);
        });
    
        return lf;
    }

    getSearch(search) {
        var link = 'http://api.deezer.com/search?q=' + search;
    
        var lf = fetch(link).then(function(response) {
            return response.json();
        }).then (function(data) {
            // console.log(data);
            return data
        }).catch(function(error) {
            console.log(error);
        });
    
        return lf;
    }

    getAlbums(artist) {
        var result = new Deezer().getSearch(artist);
        
        var page = result.then(function(data) {
            var liste = []
    
            for (var i = 0; i < data.data.length; i ++) {
                var find = false;
                
                for (var j = 0; j < data.data.length; j ++)
                    if (data.data[i].album.title.localeCompare(liste[j]) == 0)
                        find = true;
                if (!find)
                    liste.push(data.data[i].album.title);
            }
            return liste
        })
        return page;
    }
    getMusics(search) {
        var result = new Deezer().getSearch(search);
    
        var page = result.then(function(data) {
            var liste = []
    
            for (var i = 0; i < data.data.length; i ++)
                liste.push("[" + data.data[i].id + "] " + data.data[i].title + "(" + timetostr(data.data[i].duration) + ")");
            return liste
        })
    
        return page
    }
    getAllMusicFromSearch(search) {
        var liste = []
        
        for (var i = 0; i < 10; i ++) {
            var temp = getFetch("http://api.deezer.com/search?q=" + search + "&index=" + parseInt(i * 25)).then(function(data) {
                var tmp = []
                for (var j = 0; j < data.data.length; j ++)
                    console.log("[" + data.data[j].id + "] " + data.data[j].title + "(" + timetostr(data.data[j].duration) + ")");
                    // tmp.push("[" + data.data[j].id + "] " + data.data[j].title + "(" + timetostr(data.data[j].duration) + ")");
                return tmp
            }).catch();
    
            // console.log(tmp)
            for (var j = 0; j < temp.length; j ++)
                liste.push(temp[j])
        }
        return liste
    }

    getSinger(search) {
        var result = new Deezer().getSearch(search).then(function(data) {
            return {"id": data.data[0].artist.id, "name": data.data[0].artist.name, "picture": data.data[0].artist.picture, "link": data.data[0].artist.link}
        })

        return result;
    }
}

// function getProfile() {
//     var link = 'https://api.deezer.com/user/me'

//     console.log(link);
//     fetch(link).then(function(response) {
//         return response.json();
//     }).then (function(data) {
//         console.log(data);
//         return data
//     }).catch(function(error){
//         console.log(error);
//     });
// }

// new Deezer().getProfile();
new Deezer().getSinger("Nekfeu")
// new Deezer().getMusics("Nekfeu").then(function(data) {
//     for (var i = 0; i < data.length; i ++)
//         console.log(data[i])
// })

// new Deezer().getAllMusicFromSearch("Nekfeu")

// var tmp = new Deezer().getAllMusicFromSearch("Nekfeu")

// for (var i = 0; i < tmp.length; i ++)
//     console.log(tmp[i])

new Deezer().getAlbums("Nekfeu").then(function(data) {console.log(data);})