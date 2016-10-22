window.jQuery = window.$ = require('jquery')
window.Tether = require('tether')
require('bootstrap')
require('angular')
require('angular-ui-router')
require('angular-block-ui')

require('./controllers/nav.controller')
require('./controllers/main.controller')
require('./controllers/hdc.controller')
require('./controllers/lab.main.controller')
require('./controllers/lab.order.controller')

require('./services/hdc.service')
require('./services/hos.service')
require('./services/lab.service')

angular.module('app', [
  'ui.router',
  'blockUI',
  'app.controllers.Nav',
  'app.controllers.Main',
  'app.controllers.HDC',
  'app.controllers.labs.Main',
  'app.controllers.labs.Order',
  'app.services.HDC',
  'app.services.HOS',
  'app.services.lab.Order'
])
  .config(($stateProvider, $urlRouterProvider, blockUIConfig) => {

    blockUIConfig.blockBrowserNavigation = true;

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: '../templates/main.html',
        controller: 'MainCtrl'
      })
    .state('lab', {
      url: '/lab',
      templateUrl: '../templates/lab-main.html',
      controller: 'LabMainCtrl'
    })
    .state('lab-order', {
      url: '/lab-order',
      templateUrl: '../templates/lab-order.html',
      controller: 'LabOrderCtrl'
    });
    
  });
