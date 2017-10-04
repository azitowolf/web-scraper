
// Script to fetch new listings from jiazaiShanghaia.com and insert those listings to our DB
// If the listings exist, simply switch the isAvailable flag to true, otherwise add to mongoDB
// If the listing does not, add to DB

// Should run every day to keep a constant 75 or so listings available at all times

const Horseman = require("node-horseman");
const fs = require('fs');

const apiEndpoint = "http://jiazaishanghai.com/new/ajax/index.ashx?cmd=gethouse&houseType=zuixin"
var fetchData = function(endPoint) {
    return new Promise(function(resolve, reject){
        const horseman = new Horseman({
            injectJquery: true,
            loadImages: false
        });
        horseman
        .open(endPoint)
        .waitForSelector('body')
        .text('body')
        .then((text) => {
            var json = JSON.parse(text);
            dailyNewListings = json.data; 
            resolve(json.data);                 
        })
        .close()   
    })
}


fetchData(apiEndpoint)
.then((data) => {
    console.log(data)
})
