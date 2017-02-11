services.factory('GeoLocalisation', ['$cordovaGeolocation', '$q', '$http', function ($cordovaGeolocation, $q, $http) {
    this.position = {};
    var that = this;
    return {
        getPosition: function () {
            var deferred = $q.defer();
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                that.position = position;
                deferred.resolve(that.position);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        getAdresse: function (lat, lng) {
            var deferred = $q.defer();

        }
    };
}])
