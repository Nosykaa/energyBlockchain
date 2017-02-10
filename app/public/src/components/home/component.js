(function(angular) {

  angular.module('tradee_home', []).component('home', {
    templateUrl: 'components/home/template.html',
    controller: function($scope, $rootScope, $location, $route, $mdDialog, $timeout) {

      this.hasNotifications = false;

      this.displayNotifications = function () {
        this.hasNotifications =  this.notifications ?
            this.notifications.length > 0 || Object.keys(this.notifications).length > 0
            : false;
      };


  });

})(window.angular);
