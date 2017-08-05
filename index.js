var Horseman = require("node-horseman");
var WebPage = require('webpage');
var fs = require('fs');
var horseman = new Horseman();

function scrapePage(id) {

    var page = WebPage.create();
        page.onLoadFinished = function(){

        var houseDataModel = {
            images: [],
            rent: 0, // yuan per month
            agent: {
                name: "",
                phone: ""
            },
            address: "",
            sqm: 0,
            beds: 0,
            baths: 0,
            description: ""  
        }    

        var _urls = page.evaluate(function(){
            var image_urls = new Array;
            var images = document.getElementsByTagName("img");
            for(q = 0; q < images.length; q++){
                if(images[q].src.match("http://jiazaishanghai.com/uploads/")){
                    image_urls.push(images[q].src);
                }
            }
            return image_urls;
        });    

        var _rent = page.evaluate(function(){
            var textNode = document.getElementsByClassName("jieshao_je")[0].childNodes[0].nodeValue;
            return textNode;
        });

        var _address = page.evaluate(function(){
            var textNode = document.getElementsByClassName("wydz")[0].childNodes[0].nodeValue;
            return textNode;
        });    

        var _sqm = page.evaluate(function(){
            var textNode = document.getElementsByClassName("xiaoqu_mingxi")[0].childNodes[4].nodeValue;
            return textNode;
        }); 

        var _beds = page.evaluate(function(){
            var textNode = document.getElementsByClassName("xiaoqu_mingxi")[0].childNodes[2].nodeValue.split("").splice(0,2).join("");
            return textNode;
        });  

        var _baths = page.evaluate(function(){
            var textNode = document.getElementsByClassName("xiaoqu_mingxi")[0].childNodes[2].nodeValue.split("").splice(4,2).join("");
            return textNode;
        });   
        
        var _description = page.evaluate(function(){
            var textNode = document.getElementsByClassName("xiangqing")[0].childNodes[0].nodeValue;
            return textNode;
        });            

        houseDataModel.images = _urls;
        houseDataModel.rent = _rent;
        houseDataModel.address = _address;
        houseDataModel.sqm = _sqm;
        houseDataModel.beds = _beds;
        houseDataModel.baths = _baths;
        houseDataModel.description = _description;

        console.log("done creating model" + JSON.stringify(houseDataModel))
        allHomeData.push(houseDataModel);
    }


    console.log("opening page " + id)
    page.open('http://jiazaishanghai.com/house_detail.html?id=' + id, function(page){
        console.log("done with page " + id)
        page.close();
        checkFinish();
    });
}

var allHomeData = [];
// scrapePage(19148);
// scrapePage(19147);
// scrapePage(19149);

var pageIds = ["19147","19148"];

var countFinished = 0, 
    maxFinished = pageIds.length;

function checkFinish(){
    countFinished++;
    if (countFinished + 1 === maxFinished) {
        phantom.exit();
    }
}



for (var i=0; i< maxFinished; i++){
    scrapePage(pageIds[i]);

}

// setTimeout(function(){
//     console.log(JSON.stringify(allHomeData))
// }, 10000);



// var path = 'output.json';

// console.log("erasing output");
// if(fs.isFile(path)){
//     fs.remove(path);
// } 

// console.log("writing to file")
// fs.write(path, JSON.stringify(allHomeData), 'w');  

// console.log("exiting phantom")


// phantom.exit();  



