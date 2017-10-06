
// Script to fetch new listings from jiazaiShanghaia.com and insert those listings to our DB
// If the listings exist, simply switch the isAvailable flag to true, otherwise add to mongoDB
// If the listing does not, add to DB

// Should run every day to keep a constant 75 or so listings available at all times

const Horseman = require("node-horseman");
const fs = require('fs');
const ObjectId = require('mongodb').ObjectID;
var request = require('request');
var rp = require('request-promise');

// getting-started.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = mongoose.connect('mongodb://azitowolf:livwell6160@ds143362.mlab.com:43362/livwell-mongodb', function (db) {
    console.log("connected to mongoDB")
});

var ListingSchema = new Schema({
    id: Number,
    images: Array,
    rent: Number,
    agent: {
        name: String,
        phone: String,
        type: String
    },
    address: String,
    district: String,
    city: String,
    sqm: Number,
    beds: Number,
    baths: Number,
    description: String,
    dateAdded: {
        day: Number,
        month: Number,
        year: Number
    },
    compound: String,
    floor: String,
    buildingType: String,
    description_en: String,
    address_en: String,
    district_en: String,
    buildingType_en: String,
    city_en: String
});

const Listing = mongoose.model('Listing', ListingSchema);

const apiEndpoint = "http://jiazaishanghai.com/new/ajax/index.ashx?cmd=gethouse&houseType=zuixin"
var fetchNewListingData = function (endPoint) {
    return new Promise(function (resolve, reject) {
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

var searchMongoByJZSHID = function(JZSHID){
    console.log("searching for: " + JZSHID);
    return new Promise(function(resolve, reject) {
        Listing.find({ id: JZSHID }, function (err, foundListing) {
            if (err) return next(err);
    
            if (foundListing.length) {
                const mongoID = foundListing[0]._id;
                resolve(mongoID);
                      
            } else {
                reject("no listing found");
    
            // NOTE 
                // here we need to scrape the site again to get full data for the newly available listing
                // I already added the data that can be extracted from the listing
    
                // var listingToInsert = new Listing({
                //     id: newListing.id,
                //     images: [newListing.tjpic2],
                //     rent: newListing.Price.split(".")[0], // need to remove zeroes
                //     agent: {
                //         name: "",
                //         phone: "",
                //         type: ""
                //     },
                //     address: newListing.Title,
                //     district: newListing.RegionType,
                //     city: "上海",
                //     sqm: newListing.Area,
                //     beds: newListing.shi,
                //     baths: newListing.ting,
                //     description: "",
                //     dateAdded: {
                //         day: Number,
                //         month: Number,
                //         year: Number
                //     },
                //     compound: xqname,
                //     floor: "",
                //     buildingType: "",
                //     description_en: String,
                //     address_en: String,
                //     district_en: String,
                //     buildingType_en: "",
                //     city_en: "Shanghai"
                // })
            }
        })
    })

}

var updateListingAvailability = function(mongoID) {
        console.log("updating availability to true for ID: " + mongoID)  
        
        return new Promise(function(resolve, reject) {

            const options = {
                method: 'POST',
                uri: "http://localhost:3000/api/update/" + mongoID + "?available=true"
            };
            
            rp(options)
                .then(function (parsedBody) {
                    resolve(parsedBody)
                })
                .catch(function (err) {
                    reject(err)
                });                                      

        })         

}



fetchNewListingData(apiEndpoint)

.then((newListingData) => {    
    console.log("new listing data fetched");
    newListingData.forEach(function (newListing) {
        searchMongoByJZSHID(newListing.id)

        .then(function(mongoID){
            updateListingAvailability(mongoID)
            
            .then(function(response){
                console.log(response)
            }, function(reason){
                console.log(reason)
            })   
        }, function(reason){
            console.log(reason)
        })
    });  

})


