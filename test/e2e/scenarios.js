'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Shop App', function() {

  it('should go to index.html', function(){
    browser().navigateTo('../../app/index.html');
    expect(browser().location().url()).toBe('/');
  });
   
  // it('should redirect index.html to index.html#/products', function() {
    // browser().navigateTo('../../app/index.html');
    // element('li.products a').click();
    // expect(browser().location().url()).toBe('/products');
  // });
  
 	  // describe('Product list view', function() {

	    // beforeEach(function() {
	      // browser().navigateTo('../../app/index.html#/products');
	    // });

	    // it('should be possible to control product order via the drop down select box', function() {
	      // expect(repeater('.products li', 'Product List').column('product.name')).
	          // toEqual(["Product 2",
	                   // "Product 1"]);

	      // select('orderProp').option('Alphabetical');

	      // expect(repeater('.products li', 'Product List').column('product.name')).
	          // toEqual(["Product 1",
	                   // "Product 2"]);
	    // });


	    // it('should render product specific links', function() {
	      // input('query').enter('one');
	      // element('.products li a').click();
	      // expect(browser().location().url()).toBe('/products/product-1');
	    // });
	  // });


	  // describe('Product detail view', function() {

	    // beforeEach(function() {
	      // browser().navigateTo('../../app/index.html#/products/product-1');
	    // });


	    // it('should display product-1 page', function() {
	      // expect(binding('product.name')).toBe('Product 1');
	    // });


	    // it('should display the first product image as the main product image', function() {
	      // expect(element('img.product').attr('src')).toBe('img/products/product-1.0.jpg');
	    // });


	    // it('should swap main image if a thumbnail image is clicked on', function() {
	      // element('.product-thumbs li:nth-child(3) img').click();
	      // expect(element('img.product').attr('src')).toBe('img/products/product-1.2.jpg');

	      // element('.product-thumbs li:nth-child(1) img').click();
	      // expect(element('img.product').attr('src')).toBe('img/products/product-1.0.jpg');
	    // });
	  // });
	  
});
