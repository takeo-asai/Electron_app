/// <reference path="../models/WindowManager.ts"/>
/// <reference path="../models/MenuManager.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/github-electron/github-electron.d.ts" />

import Electron = require("electron");
import osProcess = require("child_process");
import angular = require("angular");


class Script {
  command: string;
  interval: number;

  constructor(cmd: string, interval: number) {
    this.command = cmd;
    this.interval = interval;
  }

  exec() {
    let app = angular.module("test", []);
    app.controller("stdout", ["$scope", "$interval", ($scope, $interval) => {
      $interval( () =>
      osProcess.exec(this.command, (err, stdout, stderr) => {
        $scope.$apply(function () { // $apply is needed to be displayed ASAP (because of AJAX callback)
          $scope.data = stdout;
        });
      }), this.interval);
    }]);
  }
}

let s = new Script("ps -amcwwwxo \"command %mem %cpu\" | grep -v grep | head -13", 1000);
s.exec();
