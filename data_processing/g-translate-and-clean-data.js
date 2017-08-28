// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');
const fs = require('fs');
const _ = require('underscore');

const Listings = require('../original_data/listings_0-1000.json')

// Your Google Cloud Platform project ID + opts
const projectId = 'livwell-177808';
const translateClient = Translate({
  projectId: projectId
});
const options = {
  from: 'zh-CN',
  to: 'en'
};

// The text to translate
const text = Listings[0].description;

// All translated descriptions
var processedListings = [];

// Remove all empty listings
let removeEmptyListings = _.filter(Listings, function(listing) {
  return listing.address;
})

processListing = function(counter) {
  counter ++;
  console.log("_____________")
  console.log("cleaning and translating " + counter + "/" + removeEmptyListings.length )

  if(counter < removeEmptyListings.length) {
    listing = removeEmptyListings[counter];

    //Clean description before making req
    listing.description = listing.description
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\d{10,12}/g, "********"); 

    translateClient.translate([
      listing.address, 
      listing.description,
      listing.district,
      listing.buildingType], options)    
    .then((results) => {

      // Listing translation assignment
      const buildingTypeTranslation = results[0][3];
      const districtTranslation = results[0][2];
      const descriptionTranslation = results[0][1];
      const addressTranslation = results[0][0];
      
      listing.description_en = descriptionTranslation;
      listing.address_en = addressTranslation;
      listing.district_en = districtTranslation;
      listing.buildingType_en = buildingTypeTranslation;
      listing.city_en = "Shanghai";

      // Listing data clean
      if(typeof(listing.rent) === "string"){
        listing.rent = parseInt(listing.rent);
      }    
      
      if(typeof(listing.beds) === "string") {
          listing.beds = parseInt(listing.beds);
      }

      if(typeof(listing.baths) === "string") {
          listing.baths = parseInt(listing.baths);
      }
      
      if(typeof(listing.sqm) === "string") {
          listing.sqm = parseInt(listing.sqm);
      }

      var arr = listing.floor.split("");
      if(arr.indexOf('/')){
          if(listing.floor.match(/(\d{1,2})(?=\/)/g)){
              const floor = listing.floor.match(/(\d{1,2})(?=\/)/g)[0];
              listing.floor = parseInt(floor);
          } else {
              listing.floor = ""
          }                
      } else {
          listing.floor = parseInt(listing.floor);
      }
          
      listing.images.forEach(function(url, i){
          listing.images[i] = url.replace("http://jzsh.qianmen.co", "http://jiazaishanghai.com");
      })

      processedListings.push(listing);
      processListing(counter);
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
  } else {
    console.log("done, writing listings to output.json");
    fs.writeFile("output.json", JSON.stringify(processedListings))
  }
}

var counter = -1;
processListing(counter);