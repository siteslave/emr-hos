'use strict';

let Config = require('electron-config');
let config = new Config();

let moment = require('moment');
let request = require('request');
let fs = require('fs')
let fse = require('fs-extra');
let http = require('http');
let {app, shell} = require('electron').remote;
let path = require('path');

angular.module('app.controllers.labs.Main', [])
  .controller('LabMainCtrl', ($scope, $rootScope, $timeout, LabOrderService, blockUI) => {
    $scope.hospcode = config.get('hospcode');
    $scope.token = config.get('token');

    $scope.isPatientTab = true;
    $scope.isLabTab = false;
    
    $scope.orderId = null;
    $scope.vn = null;
    $scope.personName = null;

    $scope.showPatientTab = () => {
      $scope.isPatientTab = true;
      $scope.isLabTab = false;
    }
    $scope.showLabTab = () => {
      $scope.isPatientTab = false;
      $scope.isLabTab = true;
    }

    $scope.orderDateList = [];

    LabOrderService.getDateOrderList($scope.token, $scope.hospcode)
      .then(rows => {
        rows.forEach(v => {
          let obj = {};
          obj.engName = moment(v.order_date).format('YYYY-MM-DD');
          obj.thName = `${moment(v.order_date).format('DD/MM')}/${moment(v.order_date).get('year') + 543}`;
          $scope.orderDateList.push(obj);
        });
      });
    
    // get list
    $scope.getList = () => {
      blockUI.start();
      let status = $scope.status ? 'Y' : 'N';
      $scope.orders = [];

      LabOrderService.getList($scope.token, $scope.hospcode, status)
        .then(rows => {
          rows.forEach(v => {
            let obj = {};
            obj.order_id = v.order_id;
            obj.hos_vn = v.hos_vn;
            obj.order_date = `${moment(v.order_date).format('DD/MM')}/${moment(v.order_date).get('year') + 543}`;
            obj.order_time = moment(v.order_time, 'HH:mm:ss').format('HH:mm');
            obj.items = +v.items;
            obj.person_fullname = v.person_fullname;
            obj.person_cid = v.person_cid;
            obj.person_address = v.person_address;
            obj.confirm_status = v.confirm_status;
            $scope.orders.push(obj);
          })

          blockUI.stop();
        }, err => {
          blockUI.stop();
          alert('Error: ' + JSON.stringify(err))
        });
    }

    $scope.refresh = () => {
      $scope.getList();
    }    


    $scope.getResult = (person) => {
      $scope.orderId = person.order_id;
      $scope.vn = person.hos_vn;
      $scope.personName = person.person_fullname;
      $scope.personCid = person.person_cid;

      LabOrderService.getResult($scope.token, $scope.vn)
        .then(rows => {
          $scope.labItems = rows;
        }, err => {
          alert('Error: ' + JSON.stringify(err));
        });
    }

    $scope.printResult = () => {
      blockUI.start();
      let tmpFile = `${moment().format('x')}.pdf`;
      let tmpDir = app.getPath('temp');
      
      fse.ensureDirSync(tmpDir)

      let realTmpFile = path.join(tmpDir, tmpFile);
      
      LabOrderService.downloadResult($scope.token, $scope.vn, $scope.orderId, realTmpFile)
        .then(file => {
          blockUI.stop();
          shell.openExternal(realTmpFile);
        }, err => {
          blockUI.stop();
          alert('Error: ' + JSON.stringify(err))
        });
      
      /*
      => {
        if (err) {
          blockUI.stop();
          alert('Error: ' + JSON.stringify(err))
        } else {
          blockUI.stop();
          shell.showItemInFolder(file);
        }
      })
      */

    }

    $scope.getList();

  })
  .factory();