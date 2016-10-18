'use strict';

const Config = require('electron-config');
const config = new Config();

let url = config.get('API_URL') || 'http://localhost:3000';

angular.module('app.services.HDC', [])
  .factory('HDCService', ($q, $http) => {
    return {
      getServices(token, cid) {
        let q = $q.defer();
        let _url = `${url}/api/v1/hdc/services`;
        let params = { token: token, cid: cid };
        $http.post(_url, params)
          .success(data => {
            if (data.ok) q.resolve(data.rows)
            else q.reject(data.msg)
          })
          .error(() => {
            q.reject('Connection error')
          });

        return q.promise;
      },

      getScreenData(token, hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/v1/hdc/screen`;
        let params = { token: token, hospcode: hospcode, pid: pid, seq: seq };
        $http.post(_url, params)
          .success(data => {
            if (data.ok) q.resolve(data.screen)
            else q.reject(data.msg)
          })
          .error(() => {
            q.reject('Connection error')
          });

        return q.promise;
      },

      getDrugOPD(token, hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/v1/hdc/drug-opd`;
        let params = { token: token, hospcode: hospcode, pid: pid, seq: seq };
        $http.post(_url, params)
          .success(data => {
            if (data.ok) q.resolve(data.rows)
            else q.reject(data.msg)
          })
          .error(() => {
            q.reject('Connection error')
          });

        return q.promise;
      },

      getDrugIPD(token, hospcode, pid, an) {
        let q = $q.defer();
        let _url = `${url}/api/v1/hdc/drug-ipd`;
        let params = { token: token, hospcode: hospcode, pid: pid, an: an };
        $http.post(_url, params)
          .success(data => {
            if (data.ok) q.resolve(data.rows)
            else q.reject(data.msg)
          })
          .error(() => {
            q.reject('Connection error')
          });

        return q.promise;
      },

      getLab(token, hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/v1/hdc/lab`;
        let params = { token: token, hospcode: hospcode, pid: pid, seq: seq };
        $http.post(_url, params)
          .success(data => {
            if (data.ok) q.resolve(data.rows)
            else q.reject(data.msg)
          })
          .error(() => {
            q.reject('Connection error')
          });

        return q.promise;  
      },

      getAdmission(token, hospcode, pid, an) {
        let q = $q.defer();
        let _url = `${url}/api/v1/hdc/admission`;
        let params = { token: token, hospcode: hospcode, pid: pid, an: an };
        $http.post(_url, params)
          .success(data => {
            if (data.ok) q.resolve(data.admission)
            else q.reject(data.msg)
          })
          .error(() => {
            q.reject('Connection error')
          });

        return q.promise;  
      },

      getEFS(token, hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/v1/hdc/efs`;
        let params = { token: token, hospcode: hospcode, pid: pid, seq: seq };
        $http.post(_url, params)
          .success(data => {
            if (data.ok) q.resolve(data.efs)
            else q.reject(data.msg)
          })
          .error(() => {
            q.reject('Connection error')
          });

        return q.promise;  
      }
    }
  });