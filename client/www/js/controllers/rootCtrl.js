controllers
.controller('RootCtrl', ['$scope', '$state', '$rootScope', '$ionicLoading','$timeout', '$ionicModal','$q', 'GeoLocalisation', '$ionicPopup', 'Place',
    function($scope, $state, $rootScope, $ionicLoading, $timeout, $ionicModal,$q, GeoLocalisation, $ionicPopup, Place) {

        $rootScope.loading = {
            show: function () {
                $ionicLoading.show({ template: '<ion-spinner icon="ripple"></ion-spinner>' });
            },
            hide: function () {
                $ionicLoading.hide();
            }
        };

      $scope.elapsed = false;
      $timeout(function(){$scope.elapsed = true}, 10000);

      $ionicModal.fromTemplateUrl('templates/modal-feedback.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function(modal) {
          $rootScope.modalFeedback = modal;
      });

      $scope.feedback = function(places){

        $state.go('cockpit')
        $rootScope.modalFeedback.hide();
      }
}]);
