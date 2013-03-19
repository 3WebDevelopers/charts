'use strict';

/* Services */

angular.module('shopServices', ['ngResource']).
    factory('Alarm', function($resource){
        return $resource('api/alarms/:key', {}, { 
        });
    });
