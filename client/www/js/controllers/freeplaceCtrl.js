controllers
.controller('FreePlaceCtrl', ['$scope', '$rootScope', '$http', '$ionicPopup', '$timeout','$q' 'Place', 'GeoLocalisation',
                              function ($scope, $rootScope, $http, $ionicPopup, $timeout,$q, Place, GeoLocalisation) {

	$scope.loadingFreePlace = false;
	$scope.sendPlace = false;

    var deferred = $q.defer();
    $http.get(API_URL +'/balance/' + user.keystore.address, function (err, res) {
        $scope.balance = res.ethBalance;
    }.error(function (err) {
        deferred.reject(err);
    }));

	$scope.freeMyPlace = function () {
            if ($rootScope.swing) {
                $ionicPopup.alert({
                    title: 'Attention',
                    template: 'Vous avez déjà signalé une place !'
                });
                return;
            }
            $rootScope.swing = true;
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmation',
                template: 'Êtes vous sur de vouloir signaler une place libre à votre localisation?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    GeoLocalisation.getPosition().then(function (position){
                        $scope.loadingFreePlace = true;
                        $rootScope.loading.show();
                        console.log(position.coords.longitude + ' ' + position.coords.latitude);
                        Place.freePlace(position.coords.longitude,position.coords.latitude).success(function (data) {
                                if($rootScope.user){
                                        $rootScope.user.score += 6;
                                }
                                $scope.sendPlace = true;
                                $scope.loadingFreePlace = false;
                                $rootScope.loading.hide();
                                $ionicPopup.alert({
                                    title: 'Merci d\'avoir signalé une place vide ;)',
                                    template: 'Vous avez gagné 6 points !'
                                });
                                $timeout(function () {
                                    $scope.swing = false;
                                }, 1000*60*5);
                        }).error(function (err) {
                                $scope.sendPlace = false;
                                $rootScope.loading.hide();
                        });
                    });
                }
            });

	};


}]);
