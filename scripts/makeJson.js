//this script should be run from a folder containing the Alarms folder
//usage: node makeJson.js 
var path = require('path');
var fs = require('fs');

fs.readdir("./Alarms/", function (err, markets) {
  if(err) {
    console.log(err);
  } else {
    markets.forEach(function(market){
      fs.readdir(path.join('./Alarms/', market), function (err, alarms) {
        if(err) {
          console.log(err);
        } else {
          alarms.forEach(function(alarm){      
            var product = {};
            var alarmNameArray = alarm.split(" - ");
            
            //reading fundamental data
            fs.readFile(path.join('./Alarms/', market, alarm, 'Fundamental.txt'),
                        'utf8', function read(err, fundamentalDataFile) {
              if(err) {
                console.log(err);
              } else {
                var fundamentalDataArray = fundamentalDataFile.replace(/\r\n/g, "\n")
                                          .replace(/\r/g, "\n").split("\n")[0].split("\t");
                var fundamentalData = {
                  market:market, 
                  type: alarmNameArray[1], 
                  date: new Date(2000 + Number(alarmNameArray[2].slice(0,2)),
                                    Number(alarmNameArray[2].slice(2,4))-1,
                                    Number(alarmNameArray[2].slice(4,6)),
                                    0, 0, 0, 0),
                  symbol: fundamentalDataArray[0], 
                  name: fundamentalDataArray[1], 
                  industry: fundamentalDataArray[2], 
                  sector: fundamentalDataArray[3], 
                  pe: fundamentalDataArray[5], 
                  liquidity: 0 
                };
                product.fundamentalData = fundamentalData;
               
                // reading chart data
                fs.readFile(path.join('./Alarms/', market, alarm, 'StockValue.txt'),
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
                    
                    //reading trendlines
                    fs.readFile(path.join('./Alarms/', market, alarm, 'Disegno.txt'),
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
                        

                        
                        //create json
                        //console.log(products);
                        var id = alarm.replace(/\s/g, '');
                        fs.writeFile(path.join("./products", id + ".json"), 
                                    JSON.stringify(product, null, 2), function(err) {
                            if(err) {
                              console.log(err);
                            } else {
                              //console.log("JSON saved to " + id + ".json");
                            }
                        });
                        
                        var shortProduct = {
                          id: id, 
                          imageUrl: "img/products/resistance.png", 
                          market: product.fundamentalData.market,
                          type: product.fundamentalData.type,
                          date: product.fundamentalData.date
                        };
                        
                        //still need to manually add [] in json
                        fs.appendFile('./products/products.json', 
                                      JSON.stringify(shortProduct, null, 2) + ",\n", function (err) {
                          if(err) {
                            console.log(err);
                          } else {
                            //console.log("JSON appended to products.json");
                          }
                        });                        
                      }
                    });
                  }
                });
              }
            });
          });
        }
      });
    });
  }
});

function calcLiquidity(chartData) {
  var sumCV = 0; //Sum of all CurrentCandle * CurrentCandleVolume to date
  var absSum = 0; //Sum of |(CurrentCandle - PreviousCandle)/ CurrentCandle|
  var startIdx = chartData.length - 1;
  var endIdx = (chartData.length >= 22) ? (chartData.length - 1 - 22) : 0;
  
  for(var v = startIdx; v > endIdx; v--){
	  sumCV += chartData[v].close * chartData[v].volume;
	  absSum += Math.abs((chartData[v].close - chartData[(v-1)].close)/chartData[(v-1)].close)*100;
  }
  
  var liq = Math.round((sumCV / absSum)/1000);
  //console.log("liq: "+liq);
  
	for(var i = 0; i <= startIdx; i++){
		chartData[i].liquidity = liq;
	}
}