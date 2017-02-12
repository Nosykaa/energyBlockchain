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
        saveUserContract: function (homeAddress, boxAddress, carAddress, sellPrice, chargingContractAddress) {
            var deferred = $q.defer();

            var user = {};
            user['chargingHistory'] = [];
            user['userAddress'] = boxAddress;
            user['homeAddress'] = homeAddress;
            user['carAddress'] = carAddress;
            user['sellPrice'] = sellPrice;

            user.chargingHistory.push(
                {
                    userAddress:boxAddress,
                    homeAddress:homeAddress,
                    carAddress:carAddress,
                    sellPrice:sellPrice,
                    chargingContractAddress:chargingContractAddress
                }
            )

            var req = {
                method: 'POST',
                url: 'http://localhost:5000/charging/deploy',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:user
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

            user = {
                amountToKeep:amountToKeep,
                userAddress:carAddress
            };

            var req = {
                method: 'POST',
                url: 'http://localhost:5000/charging/' + carAddress + '/chargeStarted',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:user
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

            var user = {};
            user['chargingHistory'] = [];
            user = {
                endMeterReading:endMeterReading,
                contractAddress:contractAddress,
                userAddress:userAddress
            };

            var req = {
                method: 'POST',
                url: 'http://localhost:5000/charging/' + userAddress + '/chargeCompleted',
                headers: {
                    'Content-Type': 'application/json'
                },
                data:user
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
            $http.get('http://localhost:5000' + '/homeGrid/0xd43b66860e901804d3938376fca59dc66951973a/prosumers')
            .success(function (data) {
                deferred.resolve(data);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

    };
}])
