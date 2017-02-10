(function(angular) {

  var app = angular.module('tradee_app', ['ngRoute', 'ngMaterial', 'md.data.table', 'dataGrid', 'pagination',
    'tradee_navbar',
    'tradee_register',
    'tradee_login'
  ]);


  app.config(function($routeProvider, $mdThemingProvider, $compileProvider) {


    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|data):/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob|data):/);
    $compileProvider.preAssignBindingsEnabled(true);

    $routeProvider
      .when('/register', { template: '<register></register>' })
      .when('/login', { template: '<login></login>' })
      .when('/home', { template: '<home></home>' })
      .otherwise({ redirectTo: '/login' });

    $mdThemingProvider.definePalette('deloitte', {
      '50': '#86BC25',
      '100': '#ffcdd2',
      '200': '#ef9a9a',
      '300': '#e57373',
      '400': '#ef5350',
      '500': '#86BC25', //primary
      '600': '#84aa3b', //hover
      '700': '#d32f2f',
      '800': '#c62828',
      '900': '#b71c1c',
      'A100': '#ff8a80',
      'A200': '#ff5252',
      'A400': '#86BC25',
      'A700': '#d50000',


    });

    $mdThemingProvider.theme('default')
      .primaryPalette('deloitte')
      .accentPalette('grey', {
        'default': '600',
        'hue-1': '100'
      })

  });

})(window.angular);
