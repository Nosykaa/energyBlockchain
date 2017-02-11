services.factory('DashboardData', ['$http', '$q', 'Config', function ($http, $q, Config) {
    return {
        get_list_of_cars: function (_api_key, _api_secret) {
            var deferred = $q.defer();
            $http.get(API_URL + '/user/profile').success(function (user) {
                that.user = user;
                that.user.position = JSON.parse(that.user.position);
                deferred.resolve(that.user);
            }).error(function (err) {
                console.log(err);
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
