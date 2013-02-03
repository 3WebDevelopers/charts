'use strict';

/* App Module */

angular.module('shop', ['shopServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/products', {templateUrl: 'partials/product-list.html',   controller: ProductListCtrl}).
      when('/products/:productId', {templateUrl: 'partials/product-detail.html', controller: ProductDetailCtrl}).
      when('/', {templateUrl: 'partials/homepage.html', controller: HomepageCtrl}).
      when('/notfound', {templateUrl: 'partials/notfound.html', controller: NotfoundCtrl}).
      otherwise({redirectTo: '/notfound'});
}]);
