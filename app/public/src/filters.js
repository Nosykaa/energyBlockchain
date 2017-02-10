(function(angular) {

    var app = angular.module('tradee_app');

    app.filter('capitalize', function() {
        return function(value) {
            if (!value) return;
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    });

    app.filter('splitUnderscore', function() {
        return function(value) {
            if (!value) return;
            return value.split('_').join(' ');
        }
    });

    app.filter('camelToHuman', function () {
      return function (value) {
        if (!value) return;
        return value
        // insert a space before all caps
          .replace(/([A-Z])/g, ' $1')
          // uppercase the first character
          .replace(/^./, function(str){ return str.toUpperCase(); })
      }
    })

})(window.angular);
