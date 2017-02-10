(function(angular) {

  angular.module('tradee_navbar', []).component('navbar', {
    templateUrl: 'components/navbar/template.html',
    controller: function($scope, $rootScope, $mdSidenav, $location,$mdDialog, $mdToast) {


      this.sidebar = function() {
        $mdSidenav('left').toggle();
      };


      this.audit = function () {

        $scope.isLoading = true;


        $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,
          preserveScope: true,
          template: `<md-dialog id="attribute-dialog" style="overflow: hidden;">
          <md-toolbar style="box-sizing: initial;">
            <div class="md-toolbar-tools">
              <h2>Balance History</h2>
              <span flex></span>
              <md-button class="md-icon-button" ng-click="attributeDialog.close()">
              </md-button>
            </div>
          </md-toolbar>
          <md-progress-circular  md-mode="indeterminate" ng-show="isLoading" style="position: relative; left: calc(50% - 25px);"></md-progress-circular>
          <md-dialog-content ng-show="!isLoading">
            <div layout="row" layout-sm="column" layout-xs="column">
              <md-card flex style="height: 100%">
                <md-card-content layout-padding>
                  <md-table-container>
                    <table class="md-table">
                      <thead class="md-head">
                      <tr class="md-row">
                        <th style="text-align: center;vertical-align: middle;" class="md-column" ><span>Amount</span></th>
                        <th style="text-align: center;vertical-align: middle;" class="md-column" ><span>From</span></th>
                        <th style="text-align: center;vertical-align: middle;" class="md-column" ><span>To</span></th>
                        <th style="text-align: center;vertical-align: middle;" class="md-column" ><span>Action</span></th>
                        <th style="text-align: center;vertical-align: middle;" class="md-column" ><span>Transaction hash </span></th>
                        <th style="text-align: center;vertical-align: middle;" class="md-column" ><span>Date</span></th>
                      </tr>
                      </thead>
                      <tbody class="md-body">
                      <tr class="md-row ng-scope" ng-repeat="balance in allbalance">
                        <td class="md-cell" style="text-align: center;">{{balance.value}}</td>
                        <td class="md-cell" style="text-align: center;">{{balance.from}}</td>
                        <td class="md-cell" style="text-align: center;">{{balance.to}}</td>
                        <td class="md-cell" style="text-align: center;">{{balance.action}}</td>
                        <td class="md-cell" style="text-align: center;">{{balance.hash}}</td>
                        <td class="md-cell" style="text-align: center;">{{balance.update_date | date : 'dd/MM/yyyy HH:mm'}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </md-table-container>
                </md-card-content>
              </md-card>
            </div>
          </md-dialog-content>
        </md-dialog>`
        })

      };

      this.logout = function() {

      };

      this.goTo = function(page) {
        $location.path(page);
      };

    }
  });

})(window.angular);
