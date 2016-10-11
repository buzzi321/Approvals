angular.module('myApprovalsApp').controller('registerCtrl',
    ['$scope', '$http',
        function ($scope, $http) {

            $scope.register= function(){
                console.log('clicked submit');
                var userdata = {email: $scope.signupModel.signupEmail,pass: $scope.signupModel.password, firstname:$scope.signupModel.firstName, lastname: $scope.signupModel.lastName, role: $scope.signupModel.role};
                console.log('userdata:', userdata);
                $http.post('/signup', userdata)

            }

        }]);


angular.module('myApprovalsApp').controller('loginCtrl', function ($scope, $http,$rootScope, $location) {

        $scope.loginverify= function(){
            console.log('clicked Login');
            var logindata = {email: $scope.signinModel.userEmail,pass: $scope.signinModel.userPass};
            console.log('userdata:', logindata);
            $http.post('/verifyuser', logindata)
                .then(function () {
                    $scope.loggedin = true;
                    $location.path('/Home');
                    $rootScope.email = $scope.signinModel.userEmail;
                        $scope.loginForm = {};
                    console.log('logged in');

                })
                // handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username and/or password";
                    $scope.loginForm = {};
                });

        }
});


angular.module('myApprovalsApp').controller('GetApprovalsCtrl',
    ['$scope', '$location','$rootScope','$http',
        function ($scope, $location, $rootScope, $http) {
            var data = {email: $rootScope.email};
            console.log('Email Sent ', data);
            $http.post('/getApprovals', data)
                .then(function (response) {
                    $scope.ApprovalsInput = response.data;
                    var length = response.data.length;
                    console.log('Get Approvals Success', $scope.ApprovalsInput, length);

                })
                // handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Get ApprovalsError";

                });


        }]);



angular.module('myApprovalsApp').controller('NewRequestController', function ($scope, $http, $location) {
    console.log('Entered into NewRequestController');
    $scope.newrequest = {
        org: 'DIRECTV SAT',
        posOrgAbbr: 'DS',
        requestType: 'Tech Form'
    };
    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function (state) {
        return {abbrev: state};
    });

    $scope.Roles = ['Technician User MOD POS Type', 'Field Technician Supervisor MOD POS Type', 'Field Technician Team Lead MOD POS Type'];
        $scope.submitrequest= function() {
        console.log('Submitting Request');
        var requesttopost = {org: $scope.newrequest.org,posOrgAbbr: $scope.newrequest.posOrgAbbr,userid: $scope.newrequest.userid,enabled: $scope.newrequest.enabled,
            state: $scope.newrequest.state,firstName: $scope.newrequest.firstName,lastName: $scope.newrequest.lastName,middleI: $scope.newrequest.middleI,
            empType: $scope.newrequest.empType,comments: $scope.newrequest.comments,requestType: $scope.newrequest.requestType,selectedRoles: '"' + $scope.newrequest.selectedRoles + '"',
            assignedTo: 'buzzi321@gmail.com'};
            console.log('requesttopost:', requesttopost);
        $http.post('/newrequest', requesttopost)
            .then(function () {
                $location.path('/Home');
                //$scope.newrequest = {};
                console.log('Request Saved');
            })
            // handle error
            .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "!Error, Issue with Request";
                $scope.newrequest = {};
                console.log('Request error');
            });


    }


});



angular.module('myApprovalsApp').controller('ApprovalsController', function ($scope, $http, $location) {


    this.state = $location.path();
    this.go = function (path) {
        $location.path(path);
    };


});







