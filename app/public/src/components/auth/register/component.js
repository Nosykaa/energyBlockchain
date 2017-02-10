(function(angular, dcodeIO) {

  angular.module('tradee_register', []).component('register', {
    templateUrl: 'components/auth/register/template.html',
    controller: function($scope, $http, $location ) {


      this.labels = i18n.getLabels();

      this.register = function() {

        this.isRegistering = true;

        var salt = dcodeIO.bcrypt.genSaltSync(32);
        var passwordKey = Encryption.createPasswordKeyDerived(this.password, salt);

        var username = this.username;
        var validatorId = this.validator;

        Encryption.generateKeys(this.username, passwordKey, function(err, keys) {

          if (err) {
            this.isRegistering = false;
            this.onError = true;
            this.errorMessage = err.data && err.data.message ? err.data.message : err.message ? err.message : err;
            $scope.$apply();
            return;
          }

          var encryptedKey = Encryption.encryptKey(keys.privateKey, passwordKey);

          var dataToSend = {
            username: username,
            password: Encryption.hash(passwordKey),
            salt: salt,
            exchange: {
              publicKey: keys.publicKey,
              privateKey: encryptedKey,
              validatorId: validatorId,
            },
            keystore: {
              address: "0xd06a422a366d15454d4cbb8a2e3f470d34542dd9"
            },
            type: 'contributor'
          };

          ApiClient.post('/user', dataToSend, function (err) {
            if (err) {
              this.isRegistering = false;
              this.onError = true;
              this.errorMessage = err.data && err.data.message ? err.data.message : err.message ? err.message : err;
              $scope.$apply();
              return;
            }
            $location.path('/login');
          }.bind(this));
        }.bind(this));
      }
    }
  });

})(window.angular, window.dcodeIO);
