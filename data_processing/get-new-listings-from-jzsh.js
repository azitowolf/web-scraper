
// Script to fetch new listings from jiazaiShanghaia.com and insert those listings to our DB
// If the listings exist, simply switch the isAvailable flag to true, otherwise add to mongoDB
// If the listing does not, add to DB

// Should run every day to keep a constant 75 or so listings available at all times

const Horseman = require("node-horseman");
const fs = require('fs');

// getting-started.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://azitowolf:livwell6160@ds143362.mlab.com:43362/livwell-mongodb', function (db) {
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
var fetchData = function (endPoint) {
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


fetchData(apiEndpoint)
    .then((newListingData) => {
        console.log("data fetched");

        newListingData.forEach(function (newListing) {

            console.log("searching for: " + newListing.id);
            Listing.find({ id: newListing.id }, function (err, foundListing) {
                if (err) return next(err);                

                if (foundListing.length) {
                    const mongoID = foundListing[0]._id; 

                    console.log("found, updating _id: " + mongoID)
                    Listing.findOne({ _id: mongoID }, function (err, doc){
                        console.log(doc.isAvailable)
                        doc.isAvailable = true;
                        doc.save();
                        console.log(doc)
                      });
                 
                } else {
                    console.log("no listing found");

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

        }, this);

    })
