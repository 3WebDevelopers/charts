'use strict';

/* Services */

angular.module('shopServices', ['ngResource']).
    factory('Product', function($resource){
  return $resource('products/:productId', {}, {
    query: {method:'GET', isArray:true}
  });
});
