const Horseman = require("node-horseman");
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var scrapeDatPage = function(id, endId) {
    return new Promise(function(resolve, reject){
        const horseman = new Horseman({injectJquery: true});
        var houseDataModel = {
            id: id,
            images: [],
            rent: 0, // yuan per month
            agent: {
                name: "",
                phone: "",
                type: ""
            },
            address: "",
            district: "",
            city:"上海市",
            sqm: 0,
            beds: 0,
            baths: 0,
            description: ""  
        }   

        horseman
            .open('http://jiazaishanghai.com/house_detail.html?id=' + id)
            .then(function() {
                console.log("scraping data for listing number " + id)
            })                       
            .evaluate(function () {                 
                var image_urls = new Array;
                var images = document.getElementsByTagName("img");
                for(q = 0; q < images.length; q++){
                    if(images[q].src.match("http://jiazaishanghai.com/uploads/") || images[q].src.match("http://jiazaishanghai.com/UpLoads/")){
                        image_urls.push(images[q].src);
                    }
                }
                return image_urls;  
            })    
            .then(function(image_urls){
                houseDataModel.images = image_urls
            })   
            .html(".wydz") // pulling address
            .then(function (address){
                houseDataModel.address = address
            })  
            // .then(function(){ // return if this is an empty listing
            //     if(houseDataModel.address === "") {
            //         console.log("found empty listing");
            //         houseDataModel = {
            //             id:id,
            //             emptyListing: true                        
            //         }
            //         resolve(houseDataModel); 
            //         fs.appendFile('output.json', JSON.stringify(houseDataModel), function() {
            //             console.log('appended contents to output.json');
            //         });                         
            //         horseman.close();
            //         return stepToNextListing(id, endId);
            //     }
            // })   
            .html(".jieshao_je") // pulling rent
            .then(function (rent){
                houseDataModel.rent = rent
            })
            .html(".xiaoqu_mingxi") // pulling district
            .then(function (html){
                houseDataModel.district = html.split('<span>')[0];
            })       
            .html(".xiaoqu_mingxi") // pulling sqm
            .then(function (html){
                var stringifiedHTML = html.toString();
                if(stringifiedHTML.match(/(\w*平米)/g)){                    
                    houseDataModel.sqm = stringifiedHTML.match(/(\w*平米)/g)[0]
                }                                
            })          
            .html(".xiaoqu_mingxi") // pulling beds
            .then(function (html){
                var stringifiedHTML = html.toString();
                if(stringifiedHTML.match(/(\d{1,2})(?=室)/g)) {
                    houseDataModel.beds = stringifiedHTML.match(/(\d{1,2})(?=室)/g)[0];                    
                }                
            })   
            .html(".xiaoqu_mingxi") // pulling baths
            .then(function (html){
                var stringifiedHTML = html.toString();
                if(stringifiedHTML.match(/(\d{1,2})(?=卫)/g)) {
                    houseDataModel.baths = stringifiedHTML.match(/(\d{1,2})(?=卫)/g)[0];
                }                 
            })   
            .html(".xiangqing") // pulling description
            .then(function (html){
                houseDataModel.description = html
            })   
            .html(".jieshao_phone") // pulling landlord phone
            .then(function(agentPhone){
                houseDataModel.agent.phone = agentPhone
            })   
            .html(".jieshao_name") // pulling landlord phone
            .then(function(agentName){
                houseDataModel.agent.name = agentName
            })   
            .html(".jieshao_name2") // pulling landlord type
            .then(function(html){
                var stringifiedHTML = html.toString();
                if(stringifiedHTML.match("房东")){
                    houseDataModel.agent.type = "landlord";
                } else {
                    houseDataModel.agent.type = "agent";
                }
            
            })              
            .then(function(){                
                fs.appendFile('output.json', JSON.stringify(houseDataModel), function(err) {
                    console.log('appended contents to output.json');
                });                
            })                 
            .then(function(){
                resolve(houseDataModel);                
            })             
            .then(function() {
                horseman.close();
                stepToNextListing(id, endId);
            })    
    })

}

var stepToNextListing = function(id, endId) {
    if(parseInt(id) < parseInt(endId)){
        fs.appendFile('output.json' , ',', function(err) {
            console.log('appended contents to output.json');
        });    
        console.log('finished scraping listing ' + id)
        
        // Step to next listing
        scrapeDatPage(parseInt(id) + 1, parseInt(endId))

    } else {
        fs.appendFile('output.json', ']', function(err) {
            console.log('DONE WITH PAGE SCRAPE');
        });                        
    }
}

var fullSiteScrape = function(startId, endId) {
    if (fs.existsSync('output.json')){
        fs.unlink('output.json');
        fs.writeFile('output.json', '[', function(err){
            console.log('BEGINNING PAGE SCRAPE')
        });
    }

    scrapeDatPage(parseInt(startId), endId);
}

// User input
var startId;
var endId;

rl.question('Starting Id ', (answer) => {
    startId = answer;
    rl.question('Ending Id ', (answer) => {
        endId = answer;
        rl.close();
        fullSiteScrape(startId, endId)    
    });
});





