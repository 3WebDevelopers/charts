'use strict';

/* jasmine specs for controllers go here */
describe('Shop controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });


  beforeEach(module('shopServices'));


  describe('ProductListCtrl', function(){
    var scope, ctrl, $httpBackend,
        productsData = function() {
          return [{name: 'Product 1'}, {name: 'Product 2'}]
        };
    
    
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('products/products.json').respond(productsData());

      scope = $rootScope.$new();
      ctrl = $controller(ProductListCtrl, {$scope: scope});
    }));


    it('should create "products" model with 2 products fetched from xhr', function() {
      expect(scope.products).toEqual([]);
      $httpBackend.flush();

      expect(scope.products).toEqualData(productsData());
    });


    it('should set the default value of orderProp model', function() {
      expect(scope.orderProp).toBe('prop1');
    });
  });


  describe('ProductDetailCtrl', function(){
    var scope, ctrl, $httpBackend,
        xyzProductData = function() {
          return {
            name: 'product xyz',
                images: ['image/url1.png', 'image/url2.png']
          }
        };


    beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('products/xyz.json').respond(xyzProductData());

      $routeParams.productId = 'xyz';
      scope = $rootScope.$new();
      ctrl = $controller(ProductDetailCtrl, {$scope: scope});
    }));


    it('should fetch product detail', function() {
      expect(scope.product).toEqualData({});
      $httpBackend.flush();

      expect(scope.product).toEqualData(xyzProductData());
    });
  });
});
