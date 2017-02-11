services.factory('Config', [function () {
	return {
		modeHorsConnexion: false,
		horsConnexion: false,
		token: '',
		mapsIsLoaded: false,
		modeTrace: true
	};
}])


services.factory('Prise', ['$http', function ($http) {
    return {
        typePrises: function () {
            return $http.get(API_URL + '/map/getAllTypesOfOutlet');
        },
        findPrises: function (type) {
            return $http.get(API_URL + '/map/findChargingStation/' + type);
        }
    };
}])
