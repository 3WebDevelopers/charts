// this nodejs script should be run from a folder containing the market folders
// you can edit settings in the lines starting at 17, including server info
// usage: 
// node submitAlarms.js date
// node submitAlarms.js
// dates should be in YYMMDD format, for example 130120
// ONLY SUBMIT ONE DATE AT A TIME

var path = require('path');
var fs = require('fs');
var http = require('http');
var readline = require('readline');


// SETTINGS
// options
var logProgress = true;
var logErrors = true;
var sendData =  true;

// server information
var serverInfo = {host: "::1", 
                            port: "8080",
                            path: '/api/market_data'};

// allowed data
// name_in_folder : name_in_db
var allowedMarkets = {
    // "BS_HKEX": "HKEX",
    // "BS_LSE": "LSE",
    // "BS_MLSE": "MLSE",
    // "BS_NASDAQ": "NASDAQ",
    // "BS_NYSE": "NYSE",
    "BS_PAR": "PAR"
}
// END SETTINGS


var startDate;
var endDate;

if (process.argv.length == 4){
	// startDate = parseInt(process.argv[2]);
	// endDate =	parseInt(process.argv[3]);
    startDate = endDate = parseInt(process.argv[2]);
} else if (process.argv.length == 3){
	startDate = endDate = parseInt(process.argv[2]);
} else {
	var dateArray = (new Date()).toISOString().split('T')[0].split('-');
	var dateStr = dateArray[0][2]+dateArray[0][3]+dateArray[1]+dateArray[2];
	startDate = endDate = parseInt(dateStr);
}

console.log('PROCESSING DATES FROM ' + startDate + ' TO ' +  endDate + ', INCLUSIVE.');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("CONFIRM? Y/N\n", function(answer) {
	rl.close();
	if (answer.toLowerCase() != 'y'){
		process.exit()
	} else {
	
		// Queuing reads and writes, so your nodejs script doesn't overwhelm system limits catastrophically
		global.maxFilesInFlight = 100; // Set this value to some number safeish for your system
		var origRead = fs.readFile;
		var origWrite = fs.writeFile;

		var activeCount = 0;
		var pending = [];

		var wrapCallback = function(cb){
			return function(){
				activeCount--;
				cb.apply(this,Array.prototype.slice.call(arguments));
				if (activeCount < global.maxFilesInFlight && pending.length){
					//console.log("Processing Pending read/write");
					pending.shift()();
				}
			};
		};
		fs.readFile = function(){
			var args = Array.prototype.slice.call(arguments);
			if (activeCount < global.maxFilesInFlight){
				if (args[1] instanceof Function){
					args[1] = wrapCallback(args[1]);
				} else if (args[2] instanceof Function) {
					args[2] = wrapCallback(args[2]);
				}
				activeCount++;
				origRead.apply(fs,args);
			} else {
				//console.log("Delaying read:",args[0]);
				pending.push(function(){
					fs.readFile.apply(fs,args);
				});
			}
		};

		fs.writeFile = function(){
			var args = Array.prototype.slice.call(arguments);
			if (activeCount < global.maxFilesInFlight){
				if (args[1] instanceof Function){
					args[1] = wrapCallback(args[1]);
				} else if (args[2] instanceof Function) {
					args[2] = wrapCallback(args[2]);
				}
				activeCount++;
				origWrite.apply(fs,args);
			} else {
				//console.log("Delaying write:",args[0]);
				pending.push(function(){
					fs.writeFile.apply(fs,args);
				});
			}
		};	
	
		fs.readdir("./", function (err, markets) {
			if(err) {
				console.log(err);
			} else {
				markets.forEach(function(market){
					if(market in allowedMarkets) {
						fs.readdir(path.join('./', market, "DATA"), function (err, dataPointsFileNames) {
							if(err) {
								console.log(err);
							} else {
								dataPointsFileNames.forEach(function(dataPointsFileName){      
									if (parseInt(dataPointsFileName) >= startDate && parseInt(dataPointsFileName) <= endDate ){
										//reading daily data
										fs.readFile(path.join('./', market, "DATA", dataPointsFileName),
													'utf8', function read(err, dataPointsFile) {
											if(err) {
												console.log(err);
											} else {
												if (logProgress) {
													console.log('PROCESSING: ' + path.join('./', market, "DATA", dataPointsFileName));
												}
												
												date = new Date(2000 + parseInt(dataPointsFileName.slice(0,2)),
																		parseInt(dataPointsFileName.slice(2,4))-1,
																		parseInt(dataPointsFileName.slice(4,6)),
																		0, 0, 0, 0);
																		
												var dataPointsString = dataPointsFile.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
                                                var dataPoints = [];
                                                
												dataPointsString.forEach(function(dataPointString){
													if (dataPointString){
                                                        var dataPointArray = dataPointString.split(" ");
                                                        
                                                        if (logErrors){
                                                            if (dataPointArray.length != 6){
                                                                console.log("INCORRECT DATA POINT FIELDS:" + path.join('./', market, "DATA", dataPointsFileName));
                                                                return;
                                                            }
                                                        }
                                                        
                                                        var dataPoint = {
                                                            date: date, 
                                                            market: allowedMarkets[market],
                                                            symbol: dataPointArray[0], 
                                                            open: parseFloat(dataPointArray[1]), 
                                                            high: parseFloat(dataPointArray[2]), 
                                                            low: parseFloat(dataPointArray[3]), 
                                                            close: parseFloat(dataPointArray[4]), 
                                                            volume: parseFloat(dataPointArray[5])
                                                        };	
                                                        
                                                        dataPoints.push(dataPoint);
                                                    }
												});
                                                
                                                if (sendData){
                                                     // send json to server
                                                    postData = JSON.stringify(dataPoints, null, 2);
                                                    
                                                    var options = {
                                                        host: serverInfo.host,
                                                        port: serverInfo.port,
                                                        path: serverInfo.path,
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/x-www-form-urlencoded',
                                                            'Content-Length': postData.length
                                                        }   
                                                    };

                                                    var req = http.request(options, function(res) {
                                                        // console.log('STATUS: ' + res.statusCode);
                                                        // console.log('HEADERS: ' + JSON.stringify(res.headers));
                                                        // res.setEncoding('utf8');
                                                        // res.on('data', function (chunk) {
                                                            // console.log('BODY: ' + chunk);
                                                        // });
                                                    });

                                                    req.on('error', function(e) {
                                                        console.log('problem with request: ' + e.message);
                                                    });

                                                    // write data to request body
                                                    req.write(postData);
                                                    req.end();
                                                }                                                 
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
});