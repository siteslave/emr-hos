import { ipcRenderer } from 'electron'


const Config = require('electron-config');
const config = new Config();

angular.module('app.controllers.Nav', [])
  .controller('NavCtrl', ($scope, $rootScope, HOSService) => {
    HOSService.getHospital()
      .then(hospital => {
        $scope.hospitalName = hospital.hospitalname
        config.set('hospname', hospital.hospitalname)
        config.set('hospcode', hospital.hospitalcode)
        // console.log(hospital)
      });
    
    $scope.showDebug = () => {
      ipcRenderer.send('show-debug');
    };

    $scope.refresh = () => {
      location.reload()
    };
  });