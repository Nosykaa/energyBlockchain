controllers
.controller('DashboardCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$state', '$ionicPopup', 'DashboardData',
                              function ($scope, $rootScope, $http, $timeout, $state, $ionicPopup, DashboardData) {
    /**
    * Init controller
    */
    $scope.isLoading = false;
    $scope.dispache = false;
    $scope.energyPrice = 0;
    $scope.moneyEarned = 22;

    $scope.carList = [
        {
            moneyEarned:15,
            energyTransferred:"2 kWh",
            energyChargeTime:"8 minutes"
        },
        {
            moneyEarned:20,
            energyTransferred:"1 kWh",
            energyChargeTime:"240 minutes"
        },
        {
            moneyEarned:22,
            energyTransferred:"3 kWh",
            energyChargeTime:"400 minutes"
        },
        {
            moneyEarned:33,
            energyTransferred:"2 kWh",
            energyChargeTime:"80 minutes"
        },
        {
            moneyEarned:12,
            energyTransferred:"15 kWh",
            energyChargeTime:"300 minutes"
        }
    ];

    /**
    * Fake data setup for all money graphs. Services to be created.
    */
    $scope.moneylabels = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
    $scope.moneylabels2 = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
    $scope.etdonutlabels = ["Energy Sold", "Energy Used", "Rest"];

    $scope.etdonut = [5, 60, 35];
    $scope.moneyline = [
        [15, 20, 22, 33, 12, 33, 9]
    ];
    $scope.moneyline2 = [
        [15, 20, 22, 33, 12, 33, 9],
        [34, 80, 34, 56, 24, 55, 87],
        [100, 200, 78, 300, 96, 500, 200]
    ];

    $scope.moneyseries1 = ['Last Year','Last Month','This Week', 'Last Week'];
    $scope.moneyseries2 = ['Last Year','Last Month','This Week', 'Last Week'];

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


    /**
    * Get Data From Services
    */
    // $scope.getFinancialInformation = function () {
    //
    // };

    DashboardData.get_money().then(function(data){
        $scope.energyPrice = data[0].buyPrice;
    }).catch(error => {
        console.log('error')
        console.log(error);
    });


    //
    //
    //
    //         if($rootScope.user){
    //                 $rootScope.user.score += 6;
    //         }
    //         $scope.sendPlace = true;
    //         $scope.loadingFreePlace = false;
    //         $rootScope.loading.hide();
    //         $ionicPopup.alert({
    //             title: 'Merci d\'avoir signalé une place vide ;)',
    //             template: 'Vous avez gagné 6 points !'
    //         });
    //         $timeout(function () {
    //             $scope.swing = false;
    //         }, 1000*60*5);
    // }).error(function (err) {
    //         $scope.sendPlace = false;
    //         $rootScope.loading.hide();
    // });

    /**
    * Dashboard Routes
    */
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
