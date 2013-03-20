// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

Modernizr.load([
  {
    load: '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
    complete: function () {
      if ( !window.jQuery ) {
            Modernizr.load('js/vendor/jquery-1.8.3.min.js');
      }
    }
  },
  {
    load: 'js/vendor/bootstrap.js',
  }
]);