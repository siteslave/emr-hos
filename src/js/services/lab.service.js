'use strict';

const Config = require('electron-config');
const config = new Config();
let fs = require("fs")
let http = require('http');

let url = config.get('API_URL') || 'http://localhost:3000';

angular.module('app.services.lab.Order', [])
  .factory('LabOrderService', ($http, $q) => {
    return {
      getLabGroup(token) {
        let q = $q.defer();
        let _url = `${url}/api/v1/hos/lab-group`;
        let params = { token: token };
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

      getLabItems(token, groupId) {
        let q = $q.defer();
        let _url = `${url}/api/v1/hos/lab-items`;
        let params = { token: token, groupId: groupId };
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

      saveOrder(token, hospcode, person, labItems) {
        let q = $q.defer();
        let _url = `${url}/api/v1/lab/save`;
        let params = { token: token, hospcode: hospcode, person: person, labItems: labItems };
        $http.post(_url, params)
          .success(data => {
            if (data.ok) q.resolve()
            else q.reject(data.msg)
          })
          .error(() => {
            q.reject('Connection error')
          });

        return q.promise;
      },

      getList(token, hospcode, status) {
        let q = $q.defer();
        let _url = `${url}/api/v1/lab/list`;
        let params = { token: token, hospcode: hospcode, status: status };
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

      getResult(token, vn) {
        let q = $q.defer();
        let _url = `${url}/api/v1/lab/result`;
        let params = { token: token, vn: vn };

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

      getDateOrderList(token, hospcode) {
        let q = $q.defer();
        let _url = `${url}/api/v1/lab/date-list`;
        let params = { token: token, hospcode: hospcode };

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

      downloadResult(token, vn, orderId, tmpFile) {
        let q = $q.defer();
        let _url = `${url}/api/v1/lab/result-print?token=${token}&vn=${vn}&orderId=${orderId}`;
        // let params = { token: token, orderId: orderId, vn: vn };

        var file = fs.createWriteStream(tmpFile);
        var _request = http.get(_url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close(q.resolve(file));
          });
        }).on('error', (err) => { // Handle errors
          fs.unlink(dest);
          q.reject(err.message);
        });
        
        return q.promise;
      }
    }
  });