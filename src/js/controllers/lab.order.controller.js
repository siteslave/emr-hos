'use strict';

const Config = require('electron-config');
const config = new Config();

let _ = require('lodash')

angular.module('app.controllers.labs.Order', [])
  .controller('LabOrderCtrl', ($scope, $rootScope, LabOrderService,HOSService, blockUI) => {
  
    $scope.isPatientTab = true;
    $scope.isLabTab = false;

    $scope.labGroups = [];
    $scope.labItems = [];
    $scope.selectedItems = [];

    $scope.token = config.get('token');
    $scope.hospcode = config.get('hospcode');

    blockUI.start();
    
    LabOrderService.getLabGroup($scope.token)
      .then(groups => {
        $scope.labGroups = groups;
        blockUI.stop();
      });
    
    $scope.showPatientTab = () => {
      $scope.isPatientTab = true;
      $scope.isLabTab = false;
    }
    $scope.showLabTab = () => {
      $scope.isPatientTab = false;
      $scope.isLabTab = true;
    }

    $scope.showLabItems = () => {
      //alert($scope.labGroupId)
      blockUI.start();
      LabOrderService.getLabItems($scope.token, $scope.labGroupId)
        .then(labs => {
          $scope.labItems = labs;
          blockUI.stop();
      })
    }

    // selected item
    $scope.setSelectedLab = (lab) => {
      let idx = _.findIndex($scope.selectedItems, { lab_items_code: lab.lab_items_code });

      if (idx >= 0) {
        alert('รายการนี้มีอยู่แล้ว')
      } else {
        $scope.selectedItems.push(lab);
      }
    }

    $scope.searchPerson = () => {
      $scope.people = [];
      blockUI.start();
      if ($scope.query) {
        HOSService.searchPerson($scope.query)
          .then(people => {
            $scope.people = people;
            blockUI.stop();
          }, err => {
            alert('Error: ' + JSON.stringify(err));
            blockUI.stop();
          });
      }
    }

    $scope.enterSearch = (event) => {
      if (event.charCode == 13) {
        $scope.searchPerson()
      }
    }

    $scope.addPatient = (person) => {
      $scope.selectedPerson = person;
    }

    $scope.save = () => {
      let items = [];
      $scope.selectedItems.forEach(v => {
        items.push(v.lab_items_code)
      });

      LabOrderService.saveOrder($scope.token, $scope.hospcode, $scope.selectedPerson, items)
        .then(() => {
          alert('บันทึกรายการเสร็จเรียบร้อยแล้ว');
          $scope.selectedPerson = {};
          $scope.selectedItems = [];
        }, err => {
          alert(JSON.stringify(err))
        });
    }

    $scope.removeSelected = (idx) => {
      if (confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่?')) {
        $scope.selectedItems.splice(idx, 1)
      }
      
    }

    $scope.clear = () => {
      if (confirm('คุณต้องการยกเลิกรายการทั้งหมด ใช่หรือไม่?')) {
        $scope.selectedPerson = {};
        $scope.selectedItems = [];
      }
    }

  })
  .factory();