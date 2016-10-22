'use strict';

const Config = require('electron-config');
const config = new Config();

require('angular')
window.jQuery = window.$ = require('jquery')
window.Tether = require('tether')
require('bootstrap')

angular.module('app', [])
  .controller('SettingCtrl', ($scope) => {
    $scope.config = {};
 
    $scope.config.host = config.get('HOS_HOST') || 'localhost'
    $scope.config.port = config.get('HOS_PORT') || 3306
    $scope.config.database = config.get('HOS_DBNAME') || 'hosxp_pcu'
    $scope.config.user = config.get('HOS_USER') || 'sa'
    $scope.config.password = config.get('HOS_PASSWORD') || 'sa'
    $scope.config.url = config.get('API_URL') || 'http://localhost:3000'

    $scope.save = () => {
      config.set('HOS_HOST', $scope.config.host);
      config.set('HOS_PORT', $scope.config.port);
      config.set('HOS_DBNAME', $scope.config.database);
      config.set('HOS_USER', $scope.config.user);
      config.set('HOS_PASSWORD', $scope.config.password);
      config.set('API_URL', $scope.config.url);

      alert('บันทึกเสร็จเรียบร้อยแล้ว')
    }

    $scope.refresh = () => {
      location.reload()
    };
  });