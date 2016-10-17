let moment = require('moment');

angular.module('app.controllers.Main', ['app.services.HOS', 'app.services.HDC'])
  .controller('MainCtrl', ($scope, $rootScope, HOSService, HDCService) => {
    $scope.isHDC = false;
    $scope.isHOS = true;
    
    $scope.getHOSEmr = () => {
      $scope.isHDC = false;
      $scope.isHOS = true;
    }

    HOSService.getHospitalname()
      .then(hospitalName => {
        $scope.hospitalName = hospitalName
      });

    $scope.doSearchEnter = (event) => {
      if (event.charCode == 13) $scope.search();
    }

    $scope.search = () => {
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
          })
        }, err => {
          console.log(err);
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

      HDCService.getHPID($rootScope.cid)
        .then(hpids => {
          // console.log(rows)
          if (hpids) {
            let _hpids = [];
            hpids.forEach(v => {
              _hpids.push(v.hpid)
            })
            HDCService.getServices(_hpids)
              .then(rows => {
                rows.forEach(v => {
                  let obj = {};
                  obj.HOSPCODE = v.HOSPCODE;
                  obj.SEQ = v.SEQ;
                  obj.PID = v.PID;
                  obj.LABS = v.LABS;
                  obj.AN = v.AN;
                  obj.ORG_DATE_SERV = v.DATE_SERV;
                  obj.DATE_SERV = `${moment(v.DATE_SERV).format('DD/MM')}/${moment(v.DATE_SERV).get('year') + 543}`;
                  obj.TIME_SERV = moment(v.TIME_SERV, 'HH:mm:ss').format('HH:mm');
                  obj.HOSPNAME = v.HOSPNAME;

                  $scope.servicesHDC.push(obj)
                })
              }, err => {
                console.log(err)
              });
          } else {
            console.log('No visits')
          }
        }, err => {
          console.log(err)
        });
    }

    $scope.getHDCEmr = (service) => {

      $scope.hdcScreen = {};
      $scope.hdcDrugs = [];
      $scope.hdcLabs = [];
      console.log(service)
      $scope.getHDCScreenData(service.HOSPCODE, service.PID, service.SEQ);
      $scope.getHDCDrugOPD(service.HOSPCODE, service.PID, service.SEQ);
      $scope.getHDCLab(service.HOSPCODE, service.PID, service.SEQ);
    }

    $scope.getHDCScreenData = (hospcode, pid, seq) => {
      HDCService.getScreenData(hospcode, pid, seq)
        .then(screen => {
          $scope.hdcScreen = screen;
          $scope.hdcScreen.DATE_SERV = `${moment(screen.DATE_SERV).format('DD/MM')}/${moment(screen.DATE_SERV).get('year') + 543}`;
          $scope.hdcScreen.TIME_SERV = moment(screen.TIME_SERV, 'HHmmss').format('HH:mm:ss');
        }, err => {
          console.log(err)
        });
    }

    $scope.getHDCDrugOPD = (hospcode, pid, seq) => {
      HDCService.getDrugOPD(hospcode, pid, seq)
        .then(rows => {
          $scope.hdcDrugs = rows;
        }, err => {
          console.log(err)
        });
    }

    $scope.getHDCLab = (hospcode, pid, seq) => {
      HDCService.getLab(hospcode, pid, seq)
        .then(rows => {
          $scope.hdcLabs = rows;
        }, err => {
          console.log(err)
        });
    }

  });