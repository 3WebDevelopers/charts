// function that creates charts
function createChart(chartData, trendLines, legendSetter){
  // CHART
  chart = new AmCharts.AmStockChart();
  chart.pathToImages = "img/amcharts/";
  chart.startDuration = 2;

  // DATASETS
  var dataSet = new AmCharts.DataSet();
  dataSet.fieldMappings = [{fromField: "open", toField: "open"},
						   {fromField: "close", toField: "close"},
						   {fromField: "high", toField: "high"},
						   {fromField: "low", toField: "low"},
						   {fromField: "volume", toField: "volume"},
						   {fromField: "liquidity", toField: "liquidity"}];
  dataSet.dataProvider = chartData;
  dataSet.categoryField = "date";

  chart.dataSets = [dataSet];

  // first stock panel
  var stockPanel1 = new AmCharts.StockPanel();
  //stockPanel1.showCategoryAxis = false;
  stockPanel1.columnWidth = 0.45;
  stockPanel1.columnSpacing = 0;
  stockPanel1.percentHeight = 80;
  stockPanel1.showCategoryAxis = false;

  // Chart Graph
  var graph1 = new AmCharts.StockGraph();
  //graph1.visibleInLegend = true;
  graph1.useDataSetColors = false;
  graph1.type = "candlestick";
  //graph1.legendValueText = "open:[[open]]\thigh:[[high]]\tlow:[[low]]\tclose:[[close]]\tvolume:[[volume]]\tliquidity ratio:[[liquidity]]";
  //graph1.balloonText = "open:[[open]]\thigh:[[high]]\tlow:[[low]]\tclose:[[close]]\tvolume:[[volume]]\tliquidity ratio:[[liquidity]]";
  // graph colors
  graph1.color = "#ffffff";
  graph1.lineColor = "#ffffff";
  graph1.lineAlpha = 0.75;
  graph1.fillColors = "#00cc00";
  graph1.negativeLineColor = "#ffffff";
  graph1.negativeFillColors = "#f37417";
  graph1.fillAlphas = 1;
  // candlestick graph has 4 fields - open, low, high, close
  graph1.openField = "open";
  graph1.highField = "high";
  graph1.lowField = "low";
  graph1.closeField = "close";

  stockPanel1.addStockGraph(graph1);
  
  // create stock legend                
  /*var stockLegend1 = new AmCharts.StockLegend();
  stockLegend1.color = "#ffffff";
  stockLegend1.valueTextRegular = "open:[[open]] high:[[high]] low:[[low]] close:[[close]] volume:[[volume]] liquidity ratio:[[liquidity]]";
  stockLegend1.markerType = "none";
  stockPanel1.stockLegend = stockLegend1;*/
  
  
  // second stock panel
  var stockPanel2 = new AmCharts.StockPanel();
  //stockPanel2.showCategoryAxis = false;
  stockPanel2.columnWidth = 0.45;
  stockPanel2.columnSpacing = 0;  
  stockPanel2.percentHeight = 20;
  
  // Volume Graph
  var graph2 = new AmCharts.StockGraph();
  graph2.useDataSetColors = false;
  graph2.color = "#ffffff";
  graph2.valueField = "volume";
  graph2.type = "column";
  graph2.lineColor = "yellow";
  graph2.fillColors = "yellow"
  graph2.showBalloon = false;
  graph2.fillAlphas = 0.8;
  
  stockPanel2.addStockGraph(graph2);

  chart.panels = [stockPanel1,stockPanel2];


  // AXES
  // category
  var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
  categoryAxesSettings.color = "#ffffff";
  categoryAxesSettings.axisColor = "#ffffff";
  categoryAxesSettings.axisAlpha = 1;
  categoryAxesSettings.gridColor = "#ffffff";
  categoryAxesSettings.gridAlpha = 0.3;
  categoryAxesSettings.parseDates = true; // as our data is date-based, we set this to true
  categoryAxesSettings.minPeriod = "DD"; // our data is daily, so we set minPeriod to "DD"
  categoryAxesSettings.equalSpacing = true;
  categoryAxesSettings.inside = false;
  categoryAxesSettings.maxSeries = 366;
  categoryAxesSettings.groupToPeriods = ["ss", "10ss", "30ss", "mm", "10mm", "30mm", "hh", "DD", "2DD", "WW", "MM", "YYYY"];

  chart.categoryAxesSettings = categoryAxesSettings;

  // value
  var valueAxesSettings = new AmCharts.ValueAxesSettings();
  valueAxesSettings.color = "#ffffff";
  valueAxesSettings.dashLength = 1;
  valueAxesSettings.axisColor = "#ffffff"
  valueAxesSettings.axisAlpha = 1;
  valueAxesSettings.gridColor = "#ffffff"
  valueAxesSettings.gridAlpha = 0.3;
  chart.valueAxesSettings = valueAxesSettings;


  // TRENDLINES
  for (key in trendLines){
    var trendLine = new AmCharts.TrendLine();
    trendLine.initialDate = trendLines[key]["initialDate"];
    trendLine.finalDate = trendLines[key]["finalDate"];
    trendLine.initialValue = trendLines[key]["initialValue"];
    trendLine.finalValue = trendLines[key]["finalValue"];
    trendLine.lineThickness = 1.3;
    trendLine.lineColor = trendLines[key]["lineColor"];
    stockPanel1.addTrendLine(trendLine);
  }

// OTHER SETTINGS ////////////////////////////////////
    var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
    scrollbarSettings.graph = graph2;
    scrollbarSettings.graphType = "column";
    scrollbarSettings.graphFillAlpha = 1;
    scrollbarSettings.graphFillColor = "yellow";
    scrollbarSettings.backgroundAlpha = 1;
    scrollbarSettings.backgroundColor = "black";
    scrollbarSettings.color = "white";
    scrollbarSettings.selectedBackgroundAlpha = 0.15;
    scrollbarSettings.selectedBackgroundColor = "#ff0000";
    scrollbarSettings.updateOnReleaseOnly = false;
    scrollbarSettings.enabled = false;
    chart.chartScrollbarSettings = scrollbarSettings;

    var cursorSettings = new AmCharts.ChartCursorSettings();
    cursorSettings.valueBalloonsEnabled = true;
    chart.chartCursorSettings = cursorSettings;
    
    
    var panelsSettings = new AmCharts.PanelsSettings();
    panelsSettings.usePrefixes = true;
    panelsSettings.backgroundColor = "black";
    panelsSettings.backgroundAlpha = 1;
    chart.panelsSettings = panelsSettings;
    
    //balloon
    /*var balloon = chart.balloon;
  balloon.adjustBorderColor = true;
  balloon.color = "white";
  balloon.cornerRadius = 5;
  balloon.fillColor = "black";
  balloon.showBullet = false;*/


  // PERIOD SELECTOR ///////////////////////////////////
  var periodSelector = new AmCharts.PeriodSelector();
  periodSelector.position = "bottom";
  periodSelector.periods = [{
			      period: "MM",
			      count: 3,
			      label: "3 months",
			      selected: false
			    }, {
			      period: "MM",
			      count: 6,
			      label: "6 months",
			      selected: false
			    },{
			      period: "YTD",
			      label: "YTD",
			      selected: false
			    }, {
			      period: "YYYY",
			      count: 1,
			      label: "1 year",
			      selected: true
			    }, {
			      period: "MAX",
			      label: "MAX",
			      selected: false
			    }];
  chart.periodSelector = periodSelector;

  // WRITE
  chart.write("chartdiv");
  
  chart.panels[0].chartCursor.addListener("changed", legendSetter);
  chart.panels[1].chartCursor.addListener("changed", legendSetter);
}
