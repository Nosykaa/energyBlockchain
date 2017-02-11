controllers
.controller('DashboardCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$state',
                              function ($scope, $rootScope, $http, $timeout, $state) {
    /**
    * Init variable
    */
    $scope.isLoading = false;

    $scope.dispache = false;

    $scope.labels3 = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data3 = [300, 500, 100];

    $scope.etdonut = [300, 500, 100];
    $scope.etdonutlabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];

    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];

    $scope.data2 = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];

    $scope.labels = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
    $scope.labels2 = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

    $scope.series = ['Last Year','Last Month','This Week', 'Last Week'];
    $scope.series2 = ['Last Year','Last Month','This Week', 'Last Week'];

    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: false,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: false,
            position: 'right'
          }
        ]
      }
    };

    $scope.options2 = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: false,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: false,
            position: 'right'
          }
        ]
      }
    };

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
