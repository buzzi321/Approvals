//Define an angular module for our app
var app = angular.module('myApprovalsApp', ['ngRoute', 'switcher' ,'ngMaterial', 'ngMessages']);


app.config(function ($routeProvider) {
    $routeProvider.when("/Home", {templateUrl: "templates/Home.html"});
    $routeProvider.when("/NR", {templateUrl: "templates/NewRequests.html"});
    $routeProvider.when("/App", {templateUrl: "templates/Approvals.html"});
    $routeProvider.when("/Login", {templateUrl: "templates/signin.html"});
    $routeProvider.when("/Register", {templateUrl: "templates/signup.html"});
    $routeProvider.otherwise({redirectTo: "/Home"});


});


app.controller('ApprovalsController', function ($scope, $http, $location) {
    getTask(); // Load all available tasks
    function getTask() {
        $http.post("ajax/getTask.php").success(function (data) {
            $scope.tasks = data;
        });
    };
    $scope.addTask = function (task) {
        $http.post("ajax/addTask.php?task=" + task).success(function (data) {
            getTask();
            $scope.taskInput = "";
        });
    };
    $scope.deleteTask = function (task) {
        if (confirm("Are you sure to delete this line?")) {
            $http.post("ajax/deleteTask.php?taskID=" + task).success(function (data) {
                getTask();
            });
        }
    };

    this.state =$location.path();
    this.go=function(path){
        $location.path(path);
    };





});

app.controller('formCtrl', function ($scope) {
    $scope.master = {firstName: "", lastName: ""};
    $scope.reset = function () {
        $scope.user = angular.copy($scope.master);
    };
    $scope.save = function () {
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();
});

app.controller('inputController', function inputController ($scope) {
    $scope.project = {
        comments: 'Comments'
    };
});



app.controller('loginCtrl', function ($scope, $http) {

// this is called when button is clicked
    console.log("Entered into loginCtrl Controller");

    $scope.loginverify = function() {
            $http({
            method: 'GET',
            url: '/verifyuser'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }
});


app.controller('signupCtrl', function ($scope, $http) {

// this is called when button is clicked
    console.log("Entered into loginCtrl Controller");

    $scope.loginverify = function() {

    }
});







