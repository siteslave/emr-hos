let moment = require('moment')
let { ipcRenderer } = require('electron');

angular.module('app', [
  'blockUI',
  'app.controllers.Main',
  'app.controllers.Nav'
])
  .config((blockUIConfig) => {
    blockUIConfig.blockBrowserNavigation = true;
  });