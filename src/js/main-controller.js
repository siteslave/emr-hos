let moment = require('moment');

const Config = require('electron-config');
const config = new Config();

angular.module('app.controllers.Main', ['app.services.HOS', 'app.services.HDC'])
  .controller('MainCtrl', ($scope, $rootScope, $window, HOSService, HDCService, blockUI) => {
    $scope.isHDC = false;
    $scope.isHOS = true;

    $rootScope.token = config.get('token');
    console.log($rootScope.token);
    // $scope.progressbar = ngProgressFactory.createInstance();

    $scope.getHOSEmr = () => {
      $scope.isHDC = false;
      $scope.isHOS = true;
    }

    let myBlockUI = blockUI.instances.get('myBlockUI');
    let detailBlockUI = blockUI.instances.get('detailBlockUI');

    blockUI.start();
    
    HOSService.getHospitalname()
      .then(hospitalName => {
        $scope.hospitalName = hospitalName;
        blockUI.stop();
      });

    $scope.doSearchEnter = (event) => {
      if (event.charCode == 13) $scope.search();
    }

    $scope.search = () => {

// Start blocking the element.
      myBlockUI.start();
      
      // global cid
      $rootScope.cid = $scope.txtQuery;
      // $scope.isHDC = false;
      // $scope.isHOS = true;
      $scope.services = [];
      $scope.servicesHDC = [];
 
      HOSService.doSearch($scope.txtQuery)
        .then(rows => {
          $scope.services = [];
          getInfo($scope.txtQuery);
          rows.forEach(v => {
            let obj = {};
            obj.vstdate = `${moment(v.vstdate).format('DD/MM')}/${moment(v.vstdate).get('year') + 543}`;
            obj.vsttime = moment(v.vsttime, 'HH:mm:ss').format('HH:mm');
            obj.department = v.department;
            obj.vn = v.vn;
            obj.labs = v.labs;
            obj.efs = v.efs;
            obj.an = v.an;
            $scope.services.push(obj);
          });
          myBlockUI.stop();
        }, err => {
          console.log(err);
          myBlockUI.stop();
        });
    }

    let getInfo = (hn) => {
      HOSService.getInfo(hn)
        .then(info => {
          if (info) {
            let _birth = `${moment(info.birthday).format('DD/MM')}/${moment(info.birthday).get('year') + 543}`;
            $rootScope.cid = info.cid
            $scope.infoCID = info.cid
            $scope.infoFullname = info.fullname
            $scope.infoBirthDay = _birth
            $scope.infoAddress = `${info.addrpart} หมู่ ${info.moopart} ต.${info.tmbname} อ.${info.ampname} จ.${info.chwname}`
          
            // get hdc services
             $scope.getHDCService();
          
          } else {
            $rootScope.cid = null;
          }
        });
    }

    $scope.getEmr = (vn, an) => {

      detailBlockUI.start();

      $scope.ipd = {};
      $scope.screen = [];
      $scope.drugs = [];
      $scope.labs = [];
      $scope.efs = {};

      $scope.getScreenData(vn)
      $scope.getDrug(vn, an)
      $scope.getLabs(vn, an)
      $scope.getEyeFootScreen(vn)

      if (an) {
        $scope.getIpt(an)
      }

      detailBlockUI.stop();
    }

    $scope.getScreenData = (vn) => {
      
      HOSService.getScreenData(vn)
        .then(screen => {
          $scope.screen = screen;
          $scope.screen.vstdate = `${moment(screen.vstdate).format('DD/MM')}/${moment(screen.vstdate).get('year') + 543}`;
          $scope.screen.vsttime = moment(screen.vsttime, 'HH:mm:ss').format('HH:mm');
        }, err => {
          console.log(err)
        });
    }

    $scope.getEyeFootScreen = (vn) => {
      
      HOSService.getEyeFootScreen(vn)
        .then(screen => {
          $scope.efs = screen;
        }, err => {
          console.log(err)
        });
    }

    $scope.getDrug = (vn, an) => {
      
      HOSService.getDrug(vn, an)
        .then(rows => {
          // $scope.drugs = rows;
          rows.forEach(v => {
            let obj = {};
            obj.drugname = v.drugname;
            obj.qty = v.qty;
            obj.units = v.units;
            obj.rxdate = `${moment(v.rxdate).format('DD/MM')}/${moment(v.rxdate).get('year') + 543}`;
            obj.rxtime = moment(v.rxtime, 'HH:mm:ss').format('HH:mm');
            $scope.drugs.push(obj);
          })
        }, err => {
          console.log(err)
        });
    }

    $scope.getIpt = (an) => {
      HOSService.getIpt(an)
        .then(rows => {
          $scope.ipd = rows;
          $scope.ipd.regdate = `${moment($scope.ipd.regdate).format('DD/MM')}/${moment($scope.ipd.regdate).get('year') + 543}`;
          $scope.ipd.regtime = moment($scope.ipd.regtime, 'HH:mm:ss').format('HH:mm');
          $scope.ipd.dchdate = `${moment($scope.ipd.dchdate).format('DD/MM')}/${moment($scope.ipd.dchdate).get('year') + 543}`;
          $scope.ipd.dchtime = moment($scope.ipd.dchtime, 'HH:mm:ss').format('HH:mm');
        }, err => {
          console.log(err)
        });
    }

    $scope.getLabs = (vn, an) => {
      HOSService.getLabs(vn, an)
        .then(rows => {
          // $scope.labs = rows;
          rows.forEach(v => {
            let obj = {};
            obj.lab_items_name = v.lab_items_name;
            obj.lab_order_result = v.lab_order_result;
            obj.lab_items_unit = v.lab_items_unit;
            obj.order_date = `${moment(v.order_date).format('DD/MM')}/${moment(v.order_date).get('year') + 543}`;
            obj.order_time = moment(v.order_time, 'HH:mm:ss').format('HH:mm');
            $scope.labs.push(obj)
          })
        }, err => {
          console.log(err)
        });
    }

    //------------------ HDC --------------------// 

    $scope.activeHDCTab = () => {
      $scope.isHDC = true;
      $scope.isHOS = false;
    };
    
    $scope.getHDCService = () => {
      if ($rootScope.cid) {
        HDCService.getServices($rootScope.token, $rootScope.cid)
          .then(rows => {
            rows.forEach(v => {
              let obj = {};
              obj.HOSPCODE = v.HOSPCODE;
              obj.SEQ = v.SEQ;
              obj.PID = v.PID;
              obj.LABS = v.LABS;
              obj.AN = v.AN;
              obj.ORG_DATE_SERV = v.DATE_SERV;
              obj.DATE_SERV = v.DATE_SERV;
              obj.TIME_SERV = v.TIME_SERV;
              obj.DATE_SERV = `${moment(v.DATE_SERV).format('DD/MM')}/${moment(v.DATE_SERV).get('year') + 543}`;
              obj.TIME_SERV = moment(v.TIME_SERV, 'HH:mm:ss').format('HH:mm');
              obj.HOSPNAME = v.HOSPNAME;

              $scope.servicesHDC.push(obj)
            });
          }, err => {
            alert(JSON.stringify(err))
          });
      } else {
        alert('กรุณาระบุ เลขที่บัตรประชาชน')
      }
      
    }

    $scope.getHDCEmr = (service) => {

      detailBlockUI.start();
      
      $scope.hdcScreen = {};
      $scope.hdcDrugs = [];
      $scope.hdcLabs = [];

      HDCService.getScreenData($rootScope.token, service.HOSPCODE, service.PID, service.SEQ)
        .then(screen => {
          $scope.hdcScreen = screen;
          $scope.hdcScreen.DATE_SERV = `${moment(screen.DATE_SERV).format('DD/MM')}/${moment(screen.DATE_SERV).get('year') + 543}`;
          $scope.hdcScreen.TIME_SERV = moment(screen.TIME_SERV, 'HHmmss').format('HH:mm:ss');
          return HDCService.getDrugOPD($rootScope.token, service.HOSPCODE, service.PID, service.SEQ);
        })
        .then(rows => {
          $scope.hdcDrugs = rows;
          return HDCService.getLab($rootScope.token, service.HOSPCODE, service.PID, service.SEQ);
        })
        .then(rows => {
          $scope.hdcLabs = rows;
          detailBlockUI.stop();
        }, err => {
          detailBlockUI.stop();
          alert(JSON.stringify(err));
        });
    }

  });