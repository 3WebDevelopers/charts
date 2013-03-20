'use strict';

/* Services */

angular.module('shopServices', ['ngResource']).
    factory('Alarms', function($resource){
        return $resource('api/alarms/:key', {}, { 
        });      
    }).
    factory('AlarmFilterOptions', function($resource){
        return $resource('api/alarm_filter_options', {}, { 
        });
    });    

