angular.module('myApprovalsApp').controller('registerCtrl', function ($scope, $http,$rootScope, $location, $mdDialog) {

    $scope.register= function(){
        console.log('clicked Login');
        var registerdata = {email: $scope.signupModel.signupEmail,pass: $scope.signupModel.password, lName:$scope.signupModel.lastName, fName:$scope.signupModel.firstName, role:$scope.signupModel.role};
        console.log('registerdata:', registerdata);
        $http.post('/registeruser', registerdata)
            .then(function (response) {
                console.log('registered response', response);

                if ("err" in response.data) {
                    console.log('error:', response.data.err.message);

                    $scope.error = true;
                    $scope.errorMessage = response.data.err.message;
                    var alert = $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(response.data.err.message)
                        .ok('Ok')
                        // You can specify either sting with query selector
                        .openFrom({
                            top: -50,
                            width: 30,
                            height: 80
                        })
                        .closeTo({
                            left: 1500
                        });
                    $mdDialog.show(alert);

                }
                else {
                    $location.path('/Login');
                    //$scope.signupModel = {};
                }

            })
            // handle error
            .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "System Error";
                $scope.signupModel = {};
            });

    }
});


angular.module('myApprovalsApp').controller('loginCtrl', function ($scope, $http,$rootScope, $location, $mdDialog) {

        $scope.loginverify= function(){
            console.log('clicked Login');
            var logindata = {email: $scope.signinModel.userEmail,pass: $scope.signinModel.userPass, error:''};
            console.log('userdata:', logindata);
            $http.post('/verifyuser', logindata)
                .then(function (response) {
                    console.log('logged in', response);

                    if ("err" in response.data) {
                        console.log('error:', response.data.err.message);
                        $scope.error = true;
                        $scope.errorMessage = response.data.err.message;
                        var alert = $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Error')
                            .textContent(response.data.err.message)
                            .ok('Ok')
                            // You can specify either sting with query selector
                            .openFrom({
                                top: -50,
                                width: 30,
                                height: 80
                            })
                            .closeTo({
                                left: 1500
                            });
                        $mdDialog.show(alert);

                    }
                    else {
                        $scope.loggedin = true;
                        $location.path('/Home');
                        $rootScope.email = $scope.signinModel.userEmail;
                        $scope.loginForm = {};
                    }

                })
                // handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "System Error";
                    $scope.loginForm = {};
                });

        }
});


angular.module('myApprovalsApp').controller('GetApprovalsCtrl',
    ['$scope', '$location','$rootScope','$http',
        function ($scope, $location, $rootScope, $http) {
            //var data = {email: $rootScope.email};
            var data = {email: 'buzzi321@gmail.com'};
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


    this.isOpen = false;
    this.state = $location.path();
    this.go = function (path) {
        $location.path(path);
    };


});


angular.module('myApprovalsApp').controller('DynamicFormCtrl', ['$scope', function($scope) {

    $scope.model = {};
    var form_id = 'test';
    // we would get this from the meta api
    $http.get("/getMetaData",form_id )
        .then(function(response) {
            $scope.myWelcome = response.data;
        });


    $scope.entity = {
        name : "Course",
        fields :
            [
                {type: "text", name: "name", label: "Name" , required: true},
                {type: "text", name: "description", label: "Description" , required: true},
                {type: "select", name: "teacher_id", label: "Teacher" , endpoint: "/teachers", required: true}
            ]
    };



}]);









