services.factory('DashboardData', ['$http', '$q', 'Config', function ($http, $q, Config) {
    return {
        get_user: function () {
            var deferred = $q.defer();
            $http.get('http://localhost:5000' + '/user/box')
            .success(function (data) {
                deferred.resolve(data);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        get_car: function () {
            var deferred = $q.defer();
            $http.get('http://localhost:5000' + '/user/car')
            .success(function (data) {
                deferred.resolve(data);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        get_prosumer_address: function () {
            var deferred = $q.defer();
            $http.get('http://localhost:5000' + '/user/prosumer')
            .success(function (data) {
                deferred.resolve(data);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        startContractBlockchain: function (boxAddress,homeAddress, carAddress, sellPrice, startingPointenergy) {
            var deferred = $q.defer();

            var body = {};
            body['userAddress'] = boxAddress;
            body['homeAddress'] = homeAddress;
            body['carAddress'] = carAddress;
            body['sellPrice'] = sellPrice;
            body['startingPointenergy'] = startingPointenergy;


            var req = {
                method: 'POST',
                url: 'http://localhost:5000/charging/deploy',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:body
            }

            $http(req).success(function(data) {
                console.log('start service')
                console.log(data);
                deferred.resolve(data);
            }).error(function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        },
        saveUserContract: function (homeAddress, boxAddress, carAddress, sellPrice, startingPointenergy, chargingContractAddress, user) {
            var deferred = $q.defer();
            user.chargingHistory.push(
                {
                    userAddress:boxAddress,
                    homeAddress:homeAddress,
                    carAddress:carAddress,
                    sellPrice:sellPrice,
                    chargingContractAddress:chargingContractAddress,
                    startingPointenergy : startingPointenergy
                }
            )

            var req = {
                method: 'POST',
                url: 'http://localhost:5000/user/prosumer/charging',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:{user:user}
            }

            $http(req).success(function(data) {
                console.log('start service')
                console.log(data);
                deferred.resolve(data);
            }).error(function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        },
        confirm_charge: function (carAddress,contractAddress,amountToKeep) {
            var deferred = $q.defer();

            var body = {
                amountToKeep:amountToKeep,
                userAddress:carAddress
            };

            var req = {
                method: 'POST',
                url: 'http://localhost:5000/charging/' + carAddress + '/chargeStarted',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:body
            }

            $http(req).success(function(data) {
                console.log('confirm service')
                console.log(data);
                deferred.resolve(data);
            }).error(function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        },
        finish_charge: function (userAddress,contractAddress,endMeterReading) {
            var deferred = $q.defer();

            var body = {
                endMeterReading:endMeterReading,
                userAddress:userAddress
            };

            var req = {
                method: 'POST',
                url: 'http://localhost:5000/charging/' + userAddress + '/chargeCompleted',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:body
            }

            $http(req).success(function(data) {
                console.log('finsish service')
                console.log(data);
                deferred.resolve(data);
            }).error(function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        },
        get_money: function() {
            var deferred = $q.defer();
            $http.get('http://localhost:5000' + '/app/toto')
            .success(function (homeGridAddress) {
                $http.get('http://localhost:5000' + '/homeGrid/' + homeGridAddress + '/prosumers')
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (err) {
                    deferred.reject(err);
                });
            }).error(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        updateBalance: function (boxAddress, homeAddress, carAddress) {
            var deferred = $q.defer();
            var retunValue = {
                boxBalance : "",
                carBalance : "",
                homeBalance : ""
            };
            console.log(boxAddress + ", " + homeAddress + ", " + carAddress)
            $http.get(API_URL + '/balance/' + boxAddress)
            .then (function (boxBalance) {
                   retunValue.boxBalance = boxBalance.data;
                   $http.get(API_URL + '/balance/' + carAddress)
                    .then (function (carBalance) {
                        retunValue.carBalance = carBalance.data;
                        $http.get(API_URL + '/balance/' + homeAddress)
                        .then (function (homeBalance) {
                            retunValue.homeBalance = homeBalance.data;
                            console.log(retunValue);
                            deferred.resolve(retunValue);  
                        })    
                    }) 
            });
            return deferred.promise;
        },

    };
}])
