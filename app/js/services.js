'use strict';

/* Services */

angular.module('shopServices', ['ngResource']).
    factory('Alarm', function($resource){
  return $resource('alarms/:key', {}, {
    query: {method:'GET', isArray:true}
  });
});
