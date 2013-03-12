'use strict';

/* App Module */

angular.module('shop', ['shopServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/products', {templateUrl: 'partials/product-list.html',   controller: ProductListCtrl}).
      when('/products/:productId', {templateUrl: 'partials/product-detail.html', controller: ProductDetailCtrl}).
      when('/', {templateUrl: 'partials/homepage.html', controller: HomepageCtrl}).
      when('/notfound', {templateUrl: 'partials/notfound.html', controller: NotfoundCtrl}).
      when('/tutorial', {templateUrl: 'partials/tutorial.html', controller: TutorialCtrl}).
      when('/pricing', {templateUrl: 'partials/pricing.html', controller: PricingCtrl}).
      when('/tutorial/bottom-square-triangle', {templateUrl: 'partials/tutorial/bottom-square-triangle.html', controller: TutorialBSTCtrl}).
      when('/tutorial/top-square-triangle', {templateUrl: 'partials/tutorial/top-square-triangle.html', controller: TutorialTSTCtrl}).
      otherwise({redirectTo: '/notfound'});
}]);
