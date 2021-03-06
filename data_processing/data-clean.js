let listingData = require('../listings_0-20000.json');
const fs = require('fs');
const _ = require('underscore');

// Remove all empty listings
// let removeEmptyListings = _.filter(listingData, function(listing) {
//     return listing.address;
// })

// String processing
let newLD = listingData.map(listing => {

    // if(typeof(listing.rent) === "string"){
    //     listing.rent = parseInt(listing.rent);
    // }    
    
    // if(typeof(listing.beds) === "string") {
    //     listing.beds = parseInt(listing.beds);
    // }

    // if(typeof(listing.baths) === "string") {
    //     listing.baths = parseInt(listing.baths);
    // }
    
    // if(typeof(listing.sqm) === "string") {
    //     listing.sqm = parseInt(listing.sqm);
    // }
    // if(typeof(listing.floor) === "string") {
    //     var arr = listing.floor.split("");
    //     if(arr.indexOf('/')){
    //         if(listing.floor.match(/(\d{1,2})(?=\/)/g)){
    //             const floor = listing.floor.match(/(\d{1,2})(?=\/)/g)[0];
    //             listing.floor = parseInt(floor);
    //         } else {
    //             listing.floor = ""
    //         }                
    //     } else {
    //         listing.floor = parseInt(listing.floor);
    //     }
    // }
    
    // PHOTO URL REPLACE
    // listing.images.forEach(function(url, i){
    //     listing.images[i] = url.replace("http://jzsh.qianmen.co", "http://jiazaishanghai.com");
    // })

    // listing.isAvailable = false;

    listing.images = _.uniq(listing.images)

    // listing.description = listing.description
    //     .replace(/<\/?[^>]+(>|$)/g, "")
    //     .replace(/(\n)/g, "")
    //     .replace(/\d{10,12}/g, "********"); 
    // listing.description_en = listing.description_en
    //     .replace(/<\/?[^>]+(>|$)/g, "")
    //     .replace(/(\n)/g, "")
    //     .replace(/\d{10,12}/g, "********");         
    
    return listing
     
})

let uniq = _.uniq(newLD);

fs.writeFile('output.json', JSON.stringify(uniq), function(err){
    console.log('writing to output json')
});

