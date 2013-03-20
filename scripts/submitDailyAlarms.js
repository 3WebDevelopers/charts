// this nodejs script should be run from a folder containing the market folders
// you can edit settings in the lines starting at 17, including server info
// usage: 
// node submitAlarms.js startDate endDate
// node submitAlarms.js date
// node submitAlarms.js
// dates should be in YYMMDD format, for example 130120

var path = require('path');
var fs = require('fs');
var http = require('http');
var readline = require('readline');


// SETTINGS
// options
var logProgress = false;
var logErrors = true;
var sendData =  true;

// server information
var serverInfo = {host: '::1', 
                            port: '8080',
                            path: '/api/alarms'};
                            
// allowed data
// name_in_folder : name_in_db
var allowedPatterns = {
    "CLASSIC_BUBBA": "BOTTOM RIGHT TRIANGLE",
    "REVERSE_BUBBA": "TOP RIGHT TRIANGLE",
    "SUPPORT": "SUPPORT",
    "RESISTANCE": "RESISTANCE",
    "CLASSIC_ESGI": "BOTTOM END SWEEP",
    "REVERSE_ESGI": "TOP END SWEEP",
    "DOWN_GEAR": "BOTTOM REVERSAL",
    "UP_GEAR": "TOP REVERSAL"
};

// name_in_folder : name_in_db
var allowedMarkets = {
    "_HKEX": "HKEX",
    "_LSE": "LSE",
    "_MLSE": "MLSE",
    "_NASDAQ": "NASDAQ",
    "_NYSE": "NYSE",
    "_PAR": "PAR"
}
// END SETTINGS


var startDate;
var endDate;

if (process.argv.length == 4){
	startDate = parseInt(process.argv[2]);
	endDate =	parseInt(process.argv[3]);
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
						fs.readdir(path.join('./', market, "DBINFO"), function (err, alarms) {
							if(err) {
								console.log(err);
							} else {
								alarms.forEach(function(alarm){      
									var product = {};
									var alarmNameArray = alarm.split(" - ");
									if (alarmNameArray[1] in allowedPatterns && 
										 parseInt(alarmNameArray[2]) >= startDate &&
										 parseInt(alarmNameArray[2]) <= endDate ){
										//reading fundamental data
										fs.readFile(path.join('./', market, "DBINFO", alarm, 'Fundamental.txt'),
													'utf8', function read(err, fundamentalDataFile) {
											if(err) {
												console.log(err);
											} else {
											
												if (logProgress) {
													console.log('PROCESSING: ' + path.join('./', market, alarm));
												}
												
												var fundamentalDataArray = fundamentalDataFile.replace(/\r\n/g, "\n")
																								.replace(/\r/g, "\n").split("\n")[0].split("\t");
												var fundamentalData = {
													market:allowedMarkets[market], 
													pattern: allowedPatterns[alarmNameArray[1]],
                                                    interval: "Daily",
													date: new Date(2000 + Number(alarmNameArray[2].slice(0,2)),
																		Number(alarmNameArray[2].slice(2,4))-1,
																		Number(alarmNameArray[2].slice(4,6)),
																		0, 0, 0, 0),
													symbol: fundamentalDataArray[0], 
													name: fundamentalDataArray[1], 
													industry: fundamentalDataArray[2], 
													sector: fundamentalDataArray[3], 
													pe: parseFloat(fundamentalDataArray[5])
												};
												product.fundamentalData = fundamentalData;
												
												if (logErrors){
													if (fundamentalData.name == ''){console.log("EMPTY FUNDAMENTAL DATA NAME:"+path.join('./', market, alarm)); return;}
													if (fundamentalDataArray.length != 12){console.log("INCORRECT FUNDAMENTAL DATA FIELDS:"+path.join('./', market, alarm)); return;}
												}
												
												// reading chart data
												fs.readFile(path.join('./', market, "DBINFO", alarm, 'StockValue.txt'),
														  'utf8', function read(err, stockValueFile) {
													if(err) {
														console.log(err);
													} else {
														var stockValueArray = stockValueFile.replace(/\r\n/g, "\n")
																							.replace(/\r/g, "\n").split("\n");
														var chartData = [];
														stockValueArray.forEach(function(line){
															if (line){    
																var arr = line.split("_").slice(-1)[0].split(" ");
																var candle = {
																	date: new Date(2000 + Number(arr[0].slice(4,6)),
																			Number(arr[0].slice(2,4))-1,
																			Number(arr[0].slice(0,2)),
																			0, 0, 0, 0),
																	open: Number(arr[1]),
																	high: Number(arr[2]),
																	low: Number(arr[3]),
																	close: Number(arr[4]),
																	volume: Number(arr[5])
																};
																chartData.push(candle);
															}
														});
										
														product.chartData = chartData;
														product.fundamentalData.liquidity = calcLiquidity(chartData);
														product.fundamentalData.start = chartData[0].date;
										
														//reading trendlines
														fs.readFile(path.join('./', market, "DBINFO", alarm, 'Disegno.txt'),
															  'utf8', function read(err, stockValueFile) { 
															if(err) {
																console.log(err);
															} else {
																var rows = stockValueFile.split("\n");
																var trendLines = [];

																for (var i = 1; i < rows.length; i++){  
																	if (rows[i]) {
																		var trendLine = {};
																		var trendLineArray = rows[i].split(" ");
																	
																		switch (Number(trendLineArray[1])){
																			case 1:
																			trendLine.lineColor = "#0066ff"; //Blue Color
																			break;
																			case 2:
																			trendLine.lineColor = "#FFFF00"; //Yellow Color
																			break;
																			case 13:
																			trendLine.lineColor = "#FFFFFF"; //White Color
																			break;
																			case 18:
																			trendLine.lineColor = "#FF0000"; //Red Color
																			break;
																		}    
																	
																		trendLineArray = rows[++i].split(" ");
																		trendLine.initialDate = product.chartData[Number(trendLineArray[0]-1)].date;
																		trendLine.initialValue = parseFloat(trendLineArray[1].replace(",", "."));

																		trendLineArray = rows[++i].split(" ");
																		trendLine.finalDate = product.chartData[Number(trendLineArray[0]-1)].date;
																		trendLine.finalValue = parseFloat(trendLineArray[1].replace(",", "."));

																		trendLine.lineThickness = 1.3;

																		trendLines.push(trendLine);
																	}
																}
																product.trendLines = trendLines;

																if (sendData){
																	 // send json to server
																	postData = JSON.stringify(product, null, 2);

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
			}
		});
	}
});

function calcLiquidity(chartData) {

    var sumCV = 0; //Sum of all CurrentCandle * CurrentCandleVolume to date
    var absSum = 0; //Sum of |(CurrentCandle - PreviousCandle)/ CurrentCandle|
    var startIdx = chartData.length - 1;
    var endIdx = (chartData.length > 22) ? (chartData.length - 1 - 22) : 0;

    for(var v = startIdx; v > endIdx; v--){
        sumCV += chartData[v].close * chartData[v].volume;
        absSum += Math.abs((chartData[v].close - chartData[(v-1)].close)/chartData[(v-1)].close)*100;
    }

    return Math.round((sumCV / absSum)/1000);
}