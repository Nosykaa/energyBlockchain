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
    * Data Services
    */

    DashboardData.get_money().then(function(data){
        $scope.energyPrice = data[0].buyPrice;
    }).catch(error => {
        console.log('error')
        console.log(error);
    });


    $scope.boxAddress = "";
    $scope.carAddress = "";
    $scope.homeAddress = "";
      
    DashboardData.updateBalance($scope.boxAddress, $scope.homeAddress, $scope.carAddress).then(function(data){
        $scope.boxBalance = data.boxBalance;
        $scope.carBalance = data.carBalance;
        $scope.homeBalance = data.homeBalance;
    }).catch(error => {
        console.log('error')
        console.log(error);
    });

    $scope.amountCharged = "";
    $scope.cost = "";
    $scope.chargingContractAddress = "";
    $scope.start = function() {
        console.log('start');
        DashboardData.get_user().then(function(box){
            $scope.boxAddress = box.address;
            console.log('get_user')
            console.log("box.address" + box.address)

            DashboardData.get_car().then(function(car){
                $scope.carAddress = car.address;
                console.log('get_car')
                console.log("car.address" + car.address)

                DashboardData.get_prosumer_address().then(function(prosumer){
                    $scope.homeAddress = prosumer.address;
                    console.log('get_prosumer_address')
                    console.log("prosumer.address" + prosumer.address)
                    //Deploy contract
                    DashboardData.startContractBlockchain($scope.boxAddress,
                                                   $scope.homeAddress,
                                                   $scope.carAddress,
                                                   1,
                                                   0)
                                .then(function(chargingContractAddress){
                                    $scope.chargingContractAddress = chargingContractAddress;
                                    console.log('deploy contract')
                                    console.log(chargingContractAddress)
                                    DashboardData.saveUserContract($scope.boxAddress,
                                                    $scope.homeAddress,
                                                    $scope.carAddress,
                                                    1,
                                                    0,
                                                    $scope.chargingContractAddress,
                                                    prosumer)
                                    .then(function(user){
                                        console.log('save contract in db')
                                        console.log(user)
                                        DashboardData.updateBalance($scope.boxAddress, $scope.homeAddress, $scope.carAddress).then(function(data){
                                            $scope.boxBalance = data.boxBalance;
                                            $scope.carBalance = data.carBalance;
                                            $scope.homeBalance = data.homeBalance;
                                        }).catch(error => {
                                            console.log('error')
                                            console.log(error);
                                        });
                                    }).catch(error => {
                                        console.log('error')
                                        console.log(error);
                                    });
                                }).catch(error => {
                                    console.log('error')
                                    console.log(error);
                                });
                    

                }).catch(error => {
                    console.log('error')
                    console.log(error);
                });

            }).catch(error => {
                console.log('error')
                console.log(error);
            });

        }).catch(error => {
            console.log('error')
            console.log(error);
        });
    }

    $scope.confirm = function() {
        console.log('confirm');
        var amountToKeep = 15;
        DashboardData.confirm_charge($scope.carAddress, $scope.chargingContractAddress, amountToKeep).then(function(result){
            console.log('confirm_charge')
            console.log(result) 
            $scope.cost = amountToKeep;
            DashboardData.updateBalance($scope.boxAddress, $scope.homeAddress, $scope.carAddress).then(function(data){
                $scope.boxBalance = data.boxBalance;
                $scope.carBalance = data.carBalance;
                $scope.homeBalance = data.homeBalance;
            }).catch(error => {
                console.log('error')
                console.log(error);
            });
        }).catch(error => {
            console.log('error')
            console.log(error);
        });
    }

    $scope.finish = function() {
        console.log('finish');
        var endMeterReading = 10;
        DashboardData.get_user()
            .then(function(box){
                $scope.boxAddress = box.address;
                console.log('get_user')
                console.log(box.address)
                DashboardData.finish_charge($scope.boxAddress, $scope.chargingContractAddress, endMeterReading)
                .then(function(result){
                    console.log('confirm_charge')
                    console.log(result)
                    $scope.amountCharged = endMeterReading; 
                    DashboardData.updateBalance($scope.boxAddress, $scope.homeAddress, $scope.carAddress).then(function(data){
                        $scope.boxBalance = data.boxBalance;
                        $scope.carBalance = data.carBalance;
                        $scope.homeBalance = data.homeBalance;
                    }).catch(error => {
                        console.log('error')
                        console.log(error);
                    });
                }).catch(error => {
                    console.log('error')
                    console.log(error);
                });
            })
            .catch(error => {
                console.log('error')
                console.log(error);
            });
    }


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

    $scope.cockpit = function () {
      $scope.dispache = true;
      $timeout(function () {
          $state.go('cockpit');
      }, 1000);
    };
}]);
