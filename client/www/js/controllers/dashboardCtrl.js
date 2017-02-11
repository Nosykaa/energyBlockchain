controllers
.controller('DashboardCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$state',
                              function ($scope, $rootScope, $http, $timeout, $state) {
    /**
    * Init variable
    */
    $scope.isLoading = false;

    $scope.dispache = false;

    $scope.listOfCars = function () {
      $scope.dispache = true;
      $timeout(function () {
          $state.go('listofcars');
      }, 1000);
    };

    $scope.moneyEarned = function () {
      $scope.dispache = true;
      $timeout(function () {
          $state.go('moneyearned');
      }, 1000);
    };

    $scope.energytradeoff = function () {
      $scope.dispache = true;
      $timeout(function () {
          $state.go('energytradeoff');
      }, 1000);
    };

    $scope.currentEnergyPrices = function () {
      $scope.dispache = true;
      $timeout(function () {
          $state.go('currentenergyprices');
      }, 1000);
    };

    $scope.myHomeSettings = function () {
      $scope.dispache = true;
      $timeout(function () {
          $state.go('myhomesettings');
      }, 1000);
    };
}]);
