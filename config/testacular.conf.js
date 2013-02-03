basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/lib/angular/angular.js',
  'app/lib/angular/angular-*.js',
  'test/lib/angular/angular-mocks.js',
  'app/js/vendor/modernizr-2.6.2.min.js',
  'app/js/vendor/plugins.js',
  'app/js/vendor/jquery-1.8.3.min.js',
  'app/js/vendor/bootstrap.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];
//browsers = ['Chrome','Firefox'];
//browsers = ['Chrome','Firefox','IE'];
//browsers = ['Chrome','Firefox','IE','Opera'];

singleRun = true;

/*
ADD TO REGISTRY:
[HKEY_CURRENT_USER\Environment]
"CHROME_BIN"="C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
"FIREFOX_BIN"="C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe"
"IE_BIN"="C:\\Program Files\\Internet Explorer\\iexplore.exe"
"OPERA_BIN"="C:\\Program Files\\Opera x64\\opera.exe"
*/

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
