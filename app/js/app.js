'use strict';

/* App Module */

angular.module('shop', ['shopServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/alarms', {templateUrl: 'partials/alarms.html',   controller: AlarmCtrl}).
      when('/alarms/:key', {templateUrl: 'alarms.html', controller: AlarmCtrl}).
      when('/', {templateUrl: 'partials/homepage.html', controller: HomepageCtrl}).
      when('/notfound', {templateUrl: 'partials/notfound.html', controller: NotfoundCtrl}).
      when('/tutorial', {templateUrl: 'partials/tutorial.html', controller: TutorialCtrl}).
      when('/pricing', {templateUrl: 'partials/pricing.html', controller: PricingCtrl}).
      when('/tutorial/bottom-right-triangle', {templateUrl: 'partials/tutorial/bottom-right-triangle.html', controller: TutorialBRTCtrl}).
      when('/tutorial/top-right-triangle', {templateUrl: 'partials/tutorial/top-right-triangle.html', controller: TutorialTRTCtrl}).
      when('/tutorial/bottom-end-sweep', {templateUrl: 'partials/tutorial/bottom-end-sweep.html', controller: TutorialBESCtrl}).
      when('/tutorial/top-end-sweep', {templateUrl: 'partials/tutorial/top-end-sweep.html', controller: TutorialTESCtrl}).
      when('/tutorial/top-reversal', {templateUrl: 'partials/tutorial/top-reversal.html', controller: TutorialTRCtrl}).
      when('/tutorial/bottom-reversal', {templateUrl: 'partials/tutorial/bottom-reversal.html', controller: TutorialBRCtrl}).
      when('/tutorial/support', {templateUrl: 'partials/tutorial/support.html', controller: TutorialSUPCtrl}).
      when('/tutorial/resistance', {templateUrl: 'partials/tutorial/resistance.html', controller: TutorialRESCtrl}).
      otherwise({redirectTo: '/notfound'});
}]);
