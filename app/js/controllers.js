'use strict';

/* Controllers */

function ProductListCtrl($scope, Product) {
  $scope.products = Product.query();
  $scope.orderProp = 'market';
  $scope.marketFilter = '';
  $scope.patternFilter = '';
}

//ProductListCtrl.$inject = ['$scope', 'Product'];



function ProductDetailCtrl($scope, $routeParams, Product) {
  $scope.product = Product.get({productId: $routeParams.productId}, function(product) {
    $scope.mainImageUrl = product.images[0];
  });

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }
}


function HomepageCtrl($scope){
}

function NotfoundCtrl($scope){
	$scope.request = window.location.hash;
}
//ProductDetailCtrl.$inject = ['$scope', '$routeParams', 'Product'];
