'use strict';

/* Services */

angular.module('shopServices', ['ngResource']).
    factory('Product', function($resource){
  return $resource('products/:productId.json', {}, {
    query: {method:'GET', params:{productId:'products'}, isArray:true}
  });
});
