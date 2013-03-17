'use strict';

/* Controllers */

function AlarmCtrl($scope, $routeParams, Alarm) {
    if ($routeParams.alarmKey){
        $scope.key = $routeParams.key;
        loadAlarm();
    }

    $scope.alarms = Alarm.query();
    $scope.filters = {market: '', pattern: '', date: ''}
    $scope.key = '';

    $scope.loadAlarm = function() {
        $scope.alarm = Alarm.get({key: $scope.key}, function(alarm) {  
            $scope.open = 0;
            $scope.high = 0;
            $scope.low = 0;
            $scope.close = 0;
            $scope.volume = 0;

            alarm.chartData.forEach(function(val){ 
                val.date = new Date(val.date); 
            });
            alarm.trendLines.forEach(function(val){ 
                val.initialDate = new Date(val.initialDate);
                val.finalDate = new Date(val.finalDate);
            });

            createChart(alarm.chartData, alarm.trendLines, $scope.setLegend);
        });
    }
  
    $scope.setLegend = function (event){
        if(event.type == "changed" && event.index !== undefined){
            var candle = event.chart.dataProvider[event.index];
            $scope.open = candle.open;
            $scope.high = candle.high;
            $scope.low = candle.low;
            $scope.close = candle.close;
            $scope.volume = candle.volume;
            $scope.$apply();
        }
    }
}

function HomepageCtrl($scope){
}

function NotfoundCtrl($scope){
	$scope.request = window.location.hash;
}

function LoginCtrl($scope) {
}

function TutorialCtrl($scope){
}

function PricingCtrl($scope){
}

function TutorialBRTCtrl($scope){
}

function TutorialTRTCtrl($scope){
}

function TutorialBESCtrl($scope){
}

function TutorialTESCtrl($scope){
}

function TutorialTRCtrl($scope){
}

function TutorialBRCtrl($scope){
}

function TutorialSUPCtrl($scope){
}

function TutorialRESCtrl($scope){
}

function TutorialMenuCtrl($scope){
    $scope.applicationButtons = [
        {
            "name":     "Bottom Right Triangle",
            "ref":      "tutorial/bottom-right-triangle",
            "imgurl":   "img/tutorial/bottom_square_triangle_exampleA.png"},
        {
            "name": "Top Right Triangle",
            "ref":  "tutorial/top-right-triangle",
            "imgurl":   "img/tutorial/top_square_triangle_exampleA.png"},
        {
            "name": "Bottom End Sweep",
            "ref":  "tutorial/bottom-end-sweep",
            "imgurl":   "img/layout/under-construction.png"},
        {
            "name": "Top End Sweep",
            "ref":  "tutorial/top-end-sweep",
            "imgurl":   "img/layout/under-construction.png"},
        {
            "name": "Top Reversal",
            "ref":  "tutorial/top-reversal",
            "imgurl":   "img/layout/under-construction.png"},
        {
            "name": "Bottom Reversal",
            "ref":  "tutorial/bottom-reversal",
            "imgurl":   "img/layout/under-construction.png"},
        {
            "name": "Support",
            "ref":  "tutorial/support",
            "imgurl":   "img/layout/under-construction.png"},
        {
            "name": "Resistance",
            "ref":  "tutorial/resistance",
            "imgurl":   "img/layout/under-construction.png"}];

    $scope.switchBtn = function(btn,ref,imgurl) {
        $scope.selectedBtn = btn;
        $scope.selectedUrl = ref;
        $scope.selectedImgUrl = imgurl;
    }
    $scope.isActiveBtn = function(value) {
        return value === $scope.selectedBtn ? 'active' : '';
    }
    $scope.selectedBtn = "Bottom Right Triangle";
    $scope.selectedUrl = "tutorial/bottom-right-triangle";
    $scope.selectedImgUrl = "img/tutorial/bottom_square_triangle_exampleA.png";
}

function MainMenuCtrl($scope){
    $scope.selectedBtn = "home"
    $scope.switchBtn = function(btn){
        $scope.selectedBtn = btn;
    }
    $scope.isActiveBtn = function(value) {
        return value === $scope.selectedBtn ? 'active' : '';
    }
}