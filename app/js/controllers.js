'use strict';

/* Controllers */

function AlarmCtrl($scope, $route, $routeParams, $location, $filter, Alarms, AlarmFilterOptions) {
    $scope.alarmFilterOptions = AlarmFilterOptions.get();
    
    $scope.alarms = Alarms.query(function(){  
        if ($routeParams.key){
            var alarmList = $filter('filter')($scope.alarms, {key: $routeParams.key});
            if ( alarmList.length > 0){
                $scope.filteredAlarms = $scope.alarms;
                $scope.selectedAlarm = alarmList[0];
            }
        }
    });

    $scope.filters = {interval: '', market: '', pattern: '', date: ''};
    $scope.selectedAlarm = '';
    $scope.filteredAlarms = [];
    $scope.displayedAlarms = [];
    $scope.filteredDates = [];

    $scope.$watch('selectedAlarm', function(newValue, oldValue) {
        if (newValue != oldValue && newValue){
            //$location.path('/alarms/'+$scope.selectedAlarm.key)
            $scope.alarm = Alarms.get({key: $scope.selectedAlarm.key}, function(alarm) {  
                $scope.open = 0;
                $scope.high = 0;
                $scope.low = 0;
                $scope.close = 0;
                $scope.volume = 0;

                $scope.alarm.chartData.forEach(function(val){ 
                    val.date = new Date(val.date); 
                });
                $scope.alarm.trendLines.forEach(function(val){ 
                    val.initialDate = new Date(val.initialDate);
                    val.finalDate = new Date(val.finalDate);
                });

                createChart($scope.alarm.chartData, 
                                $scope.alarm.trendLines, 
                                function (event){
                                    if(event.type == "changed" && event.index !== undefined){
                                        var candle = event.chart.dataProvider[event.index];
                                        $scope.open = candle.open;
                                        $scope.high = candle.high;
                                        $scope.low = candle.low;
                                        $scope.close = candle.close;
                                        $scope.volume = candle.volume;
                                        $scope.$apply();
                                    }
                                });
            });
        }
    });
  
    $scope.$watch('filters', function(newValue, oldValue) {
        if (newValue != oldValue && newValue){    
            $scope.filteredAlarms = $filter('filter')($scope.alarms, 
                                                                    {interval: $scope.filters.interval, 
                                                                      market: $scope.filters.market, 
                                                                      pattern: $scope.filters.pattern
                                                                    });
            $scope.filteredDates =  $scope.filteredAlarms.map(function(elem){
                                                                                return elem.date;
                                                                            }).filter(function(elem, pos, arr){
                                                                                return arr.indexOf(elem) == pos;
                                                                            });

            if ($scope.filters.interval && $scope.filters.market && 
                $scope.filters.pattern && $scope.filters.date) {
                $scope.displayedAlarms = $filter('filter')($scope.filteredAlarms, 
                                                                            {date: $scope.filters.date});
            } else {
                $scope.displayedAlarms = [];
            }
        }
    }, true);    
    
    $scope.next = function(){
        if ($scope.displayedAlarms.length > 0){
            var ind = $scope.displayedAlarms.indexOf($scope.selectedAlarm);
            if (ind == $scope.displayedAlarms.length - 1) {ind = -1};
            $scope.selectedAlarm = $scope.displayedAlarms[ind+1];
        }
    }
    
    $scope.previous = function(){
        if ($scope.displayedAlarms.length > 0){
            var ind = $scope.displayedAlarms.indexOf($scope.selectedAlarm);
            if (ind == 0 || ind == -1){ind = $scope.displayedAlarms.length}
            $scope.selectedAlarm = $scope.displayedAlarms[ind-1];
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

function MainMenuCtrl($scope){
    $scope.selectedBtn = "home"
    $scope.switchBtn = function(btn){
        $scope.selectedBtn = btn;
    }
    $scope.isActiveBtn = function(value) {
        return value === $scope.selectedBtn ? 'active' : '';
    }
}