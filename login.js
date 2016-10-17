'use strict';

const Config = require('electron-config');
const config = new Config();

require('angular')

let url = config.get('API_URL') || 'http://localhost:3000';

angular.module('app', [])
  .controller('LoginCtrl', ($scope, $window, Login) => {
    $scope.login = () => {
      if ($scope.username && $scope.password) {
        Login.doLogin($scope.username, $scope.password)
          .success(data => {
            if (data.ok) {
              config.set('token', data.token)
              location.href = './index.html'
            } else {
              alert('ชื่อผู้ใช้งาน/รหัสผ่าน ไม่ถูกต้อง')
            }
          })
          .error(err => {
          
          });
      } else {
        alert('กรุณาระบุชื่อผู้ใช้งานและรหัสผ่าน')
      }
    }
  })
  .factory('Login', ($http, $q) => {
    return {
      doLogin(username, password) {
        let _url = `${url}/login`;
        return $http.post(_url, { username: username, password: password });
      }
    }
  });