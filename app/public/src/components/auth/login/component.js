(function(angular, CryptoJS) {

  angular.module('tradee_login', []).component('login', {
    templateUrl: 'components/auth/login/template.html',
    controller: function($scope, $http, $location, $rootScope, i18n, Encryption, SessionStorage, ErrorHandler, ApiClient, ValidatorClient) {

      this.usernameValid = false;
      this.canLog = false;

      this.labels = i18n.getLabels();

      this.login = function() {

        this.isAuthenticating = true;

        $http.post('/auth/ask', { username: this.username }).then(function(res) {
          var data = res.data;
          this.salt = data.salt;
          this.challenge = data.challenge;

          var passwordKey = Encryption.createPasswordKeyDerived(this.password, this.salt);

          ApiClient.post('/auth/confirm', {
            username: this.username,
            secret: CryptoJS.HmacSHA512(Encryption.hash(passwordKey) + '@' + this.challenge, Encryption.hash(passwordKey)).toString()
          }, function(err, auth) {

            if (err) {
              this.onError = true;
              this.isAuthenticating = false;
              this.errorMessage = err.data.message;
              $scope.$apply();
              return;
            }

            var token = auth.token;
            ApiClient.init(token);
            ApiClient.get('/auth', function (err, userData) {

              if (err) {
                this.onError = true;
                this.isAuthenticating = false;
                this.errorMessage = err.data.message;
                $scope.$apply();
                return;
              }

              var validatorId = userData.type === 'validator' ? userData._id : userData.exchange.validatorId;
              ApiClient.get('/validator/'+validatorId, function(err, validator) {

                if (err) {
                  this.isAuthenticating = false;
                  this.errorMessage = err.data.message;
                  $scope.$apply();
                  return;
                }

                ValidatorClient.authenticate(validator.endpoint, userData._id, function (err, validatorToken) {

                  if (err) {
                    this.onError = true;
                    this.isAuthenticating = false;
                    this.errorMessage = err.data.message;
                    $scope.$apply();
                    return;
                  }

                  ValidatorClient.getKeystore(validator.endpoint, function (err, validatorKeystore) {

                    if (err) {
                      this.onError = true;
                      this.isAuthenticating = false;
                      this.errorMessage = err.data.message;
                      $scope.$apply();
                      return;
                    }

                    SessionStorage.setItem('kickass', {
                      token: token,
                      publicKey: userData.exchange.publicKey,
                      privateKey: Encryption.encryptKey(
                        Encryption.decryptKey(userData.exchange.privateKey, passwordKey),
                        passwordKey
                      ),
                      secret: passwordKey,
                      validator: {
                        publicKey: validator.publicKey,
                        id: validatorId,
                        uri: validator.endpoint,
                        address: validatorKeystore.address,
                        token: validatorToken,
                        name: validator.name
                      }
                    });

                    $location.path('/');
                  }.bind(this));
                }.bind(this));
              }.bind(this));
            }.bind(this));
          }.bind(this));

        }.bind(this))
        .catch(function (err) {
          this.isAuthenticating = false;
          this.onError = true;
          this.errorMessage = err.data.message;
          $scope.$apply();
        }.bind(this));
      };

      this.goRegisterPage = function() {
        $location.path('/register');
      };
    }
  });

})(window.angular, window.CryptoJS);
