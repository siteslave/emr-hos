import { ipcRenderer } from 'electron'

angular.module('app.controllers.Nav', ['app.services.HOS'])
  .controller('NavCtrl', ($scope, $rootScope, HOSService) => {
    HOSService.getHospitalname()
      .then(hospitalName => {
        $scope.hospitalName = hospitalName
      });
    
    $scope.showDebug = () => {
      ipcRenderer.send('show-debug');
    };

    $scope.refresh = () => {
      location.reload()
    };
  });