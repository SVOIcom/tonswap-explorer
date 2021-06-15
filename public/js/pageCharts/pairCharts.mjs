import ChartController from "/js/chartController.mjs";

let chartController = new ChartController();


const testData = {
    token1: "11",
    token2: "22",
    swapPairAdderess: "0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e2",
    groupedData:[
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22",
            swaped: 100,
            received: 10,
            fee: 1,
            date: '2021-01-25'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22",
            swaped: 150,
            received: 15,
            fee: 1,
            date: '2021-01-26'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22",
            swaped: 130,
            received: 13,
            fee: 1,
            date: '2021-01-27'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22",
            swaped: 130,
            received: 13,
            fee: 1,
            date: '2021-01-28'
        },
        {
            providedTokenRoot: "11", 
            targetTokenRoot: "22", 
            swaped: 200,
            received: 20,
            fee: 2,
            date: '2021-02-01'
        },
        {
            providedTokenRoot: "22", 
            targetTokenRoot: "11", 
            swaped: 300,
            received: 30,
            fee: 30,
            date: '2021-02-02'
        },
        {
            providedTokenRoot: "11", 
            targetTokenRoot: "22", 
            swaped: 400,
            received: 40,
            fee: 4,
            date: '2021-02-03'
        },
        {
            providedTokenRoot: "22", 
            targetTokenRoot: "11", 
            swaped: 500,
            received: 50,
            fee: 5,
            date: '2021-02-04'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 600,
            received: 60,
            fee: 6,
            date: '2021-02-05'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 400,
            received: 40,
            fee: 4,
            date: '2021-02-06'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 700,
            received: 70,
            fee: 7,
            date: '2021-02-07'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 800,
            received: 80,
            fee: 8,
            date: '2021-02-08'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 900,
            received: 90,
            fee: 9,
            date: '2021-02-09'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 400,
            received: 40,
            fee: 4,
            date: '2021-02-10'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 300,
            received: 30,
            fee: 3,
            date: '2021-02-11'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 400,
            received: 40,
            fee: 4,
            date: '2021-02-12'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 500,
            received: 50,
            fee: 5,
            date: '2021-02-13'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1000,
            received: 100,
            fee: 10,
            date: '2021-02-14'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1050,
            received: 100,
            fee: 10,
            date: '2021-02-15'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1100,
            received: 110,
            fee: 11,
            date: '2021-02-16'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1200,
            received: 120,
            fee: 12,
            date: '2021-02-17'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1300,
            received: 130,
            fee: 13,
            date: '2021-02-18'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1400,
            received: 140,
            fee: 14,
            date: '2021-02-19'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1800,
            received: 180,
            fee: 18,
            date: '2021-02-20'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1700,
            received: 170,
            fee: 17,
            date: '2021-02-21'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1400,
            received: 140,
            fee: 14,
            date: '2021-02-22'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1300,
            received: 130,
            fee: 13,
            date: '2021-02-23'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1000,
            received: 100,
            fee: 10,
            date: '2021-02-24'
        },
        {
            providedTokenRoot: "11",
            targetTokenRoot: "22", 
            swaped: 1500,
            received: 150,
            fee: 15,
            date: '2021-02-25'
        },
        
    ]
}

let data = window.chartsData || testData;

console.log(window.chartsData, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

let ox = [];
let oy = [];
let oxCheck = [];
let volumeCounter = {};

data.groupedData.forEach(function(element){
    let alreadyInCheck = oxCheck.includes(element.date);
    if (!alreadyInCheck){
        oxCheck.push(element.date);

        let day = element.date.split("-")[2];
        ox.push(day)
    }

    // console.log(volumeCounter);

    if (!volumeCounter[element.date]) {

        if (data.token1 == element.providedTokenRoot) {
            volumeCounter[element.date] = element.swaped;
        } else {
            volumeCounter[element.date] = element.received + (element.received / element.swaped) * element.fee
        }

    } else {

        if (data.token1 == element.providedTokenRoot) {
            volumeCounter[element.date] = volumeCounter[element.date] + element.swaped;
        } else {
            volumeCounter[element.date] = volumeCounter[element.date] + element.received + (element.received / element.swaped) * element.fee
        }
    }

    // console.log(Object.keys(volumeCounter) , "<<<<<<<<<<<<<")

    oy = Object.keys(volumeCounter).map(x => volumeCounter[x]);

    // console.log(volumeCounter);
    // console.log(element.date);

});

// console.log(ox);
// console.log(oy);
// console.log(oxCheck);

let ox30 = [];
let oy30 = [];

if (ox.length > 30) {
    ox30 = oxCheck.slice(-30);
} else {
    ox30 = oxCheck;
}

if (ox.length > 30) {
    oy30 = oy.slice(-30);
} else {
    oy30 = oy;
}



chartController.initConfig("bar", "volume", ox30, oy30);
chartController.drawChart("chartBar");