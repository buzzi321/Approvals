'use strict';

//Define an angular module for our app
var myApprovalsApp = angular.module('myApprovalsApp', ['ngRoute', 'ngMaterial', 'ngMessages']);


myApprovalsApp.config(function ($routeProvider) {
    $routeProvider.when("/Home", {templateUrl: "templates/Home.html"});
    $routeProvider.when("/NR", {templateUrl: "templates/NewRequests.html",controller:"NewRequestController" });
    $routeProvider.when("/App", {templateUrl: "templates/Approvals.html",controller:"GetApprovalsCtrl" });
    $routeProvider.when("/Login", {templateUrl: "templates/signin.html",controller:"loginCtrl" });
    $routeProvider.when("/Register", {templateUrl: "templates/signup.html",controller:"registerCtrl" });
    $routeProvider.when("/Test", {templateUrl: "templates/test.html",controller:"DynamicFormCtrl" });
    $routeProvider.otherwise({redirectTo: "/Login"});


});













