(function(angular) {

  angular
    .module('tradee')
    .service('ErrorHandler', function() {

      this.catch = function(error) {
        if (!error) {
          return;
        }
        console.error(error);
        this.display(error);
      }

      this.display = function(error) {
        if (!error.data) {
          return;
        }
        if (error.data.message) {
          return alert(error.data.message);
        }
        return alert(error.data);
      }
    });

})(window.angular);
