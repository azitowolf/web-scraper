let listingData = require('./listings-1500-1546');
const fs = require('fs');
const _ = require('underscore');


let removeEmptyListings = _.filter(listingData, function(listing) {
    return listing.address;
})

let newLD = removeEmptyListings.map(listing => {
        
    listing.rent = parseInt(listing.rent);
    listing.beds = parseInt(listing.beds);
    listing.baths = parseInt(listing.baths);
    listing.sqm = parseInt(listing.sqm);

    var arr = listing.floor.split("");
    listing.floor = arr.splice(1, arr.length - 2).join("");
        
    listing.images.forEach(function(url, i){
        listing.images[i] = url.replace("http://jzsh.qianmen.co", "http://jiazaishanghai.com");
    })
    listing.description = listing.description
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/\d{10,12}/g, "********"); 

    return listing

     
})

fs.writeFile('output.json', JSON.stringify(newLD), function(err){
    console.log('writing to output json')
});

