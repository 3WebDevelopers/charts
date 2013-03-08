'use strict';

/* Controllers */

function ProductListCtrl($scope, Product) {
  $scope.products = Product.query();
  $scope.orderProp = 'market';
  $scope.marketFilter = '';
  $scope.typeFilter = '';
}

//ProductListCtrl.$inject = ['$scope', 'Product'];

function ProductDetailCtrl($scope, $routeParams, Product) {
  $scope.product = Product.get({productId: $routeParams.productId}, function(product) {  
  
    $scope.open = 0;
    $scope.high = 0;
    $scope.low = 0;
    $scope.close = 0;
    $scope.volume = 0;
    
    product.chartData.forEach(function(val){ 
      val.date = new Date(val.date); 
    });
    product.trendLines.forEach(function(val){ 
      val.initialDate = new Date(val.initialDate);
      val.finalDate = new Date(val.finalDate);
    });

    createChart(product.chartData, product.trendLines, setLegend);
  });
  
  function setLegend (event){
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

//ProductDetailCtrl.$inject = ['$scope', '$routeParams', 'Product'];

function HomepageCtrl($scope){
}

function NotfoundCtrl($scope){
	$scope.request = window.location.hash;
}

function LoginCtrl($scope) {
}