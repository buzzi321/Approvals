angular.module('myApprovalsApp').controller('registerCtrl', function ($scope, $http, $rootScope, $location, $mdDialog, AuthService) {

    $scope.register = function () {
        console.log('clicked Register');
        var registerdata = {
            email: $scope.signupModel.signupEmail,
            pass: $scope.signupModel.password,
            lName: $scope.signupModel.lastName,
            fName: $scope.signupModel.firstName,
            role: $scope.signupModel.role
        };
        console.log('registerdata:', registerdata);
        //$http.post('/registeruser', registerdata)
        AuthService.register(registerdata)
            .then(function (response) {
                console.log('registered response', response);

                if ("err" in response) {
                    console.log('error:', response.err.message);

                    $scope.error = true;
                    $scope.errorMessage = response.err.message;
                    var alert = $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(response.err.message)
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
                //$scope.signupModel = {};
            });

    }
});


angular.module('myApprovalsApp').controller('loginCtrl', function ($scope, $http, $rootScope, $location, $mdDialog, AuthService) {

    $scope.loginverify = function () {
        console.log('clicked Login');
        var logindata = {email: $scope.signinModel.userEmail, pass: $scope.signinModel.userPass, error: ''};
        console.log('userdata:', logindata);
        //$http.post('/verifyuser', logindata)
        AuthService.login(logindata)
            .then(function (response) {
                console.log('logged in', response);


                if ("data" in response) {

                    $scope.loggedin = true;
                    $location.path('/Home');
                    $rootScope.email = $scope.signinModel.userEmail;
                    $scope.loginForm = {};
                }
                else if ("err" in response) {
                    $scope.loggedin = false;
                    $scope.error = true;
                    $scope.errorMessage = response.err.message;
                    var alert = $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(response.err.message)
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
                    $scope.error = true;
                    $scope.errorMessage = 'SYSTEM ERROR';

                }


            })
            // handle error
            .catch(function () {
                $scope.error = true;
                $scope.errorMessage = 'SYSTEM ERROR';
            });

    }
});


angular.module('myApprovalsApp').controller('GetApprovalsCtrl',
    ['$scope', '$location', '$rootScope', '$http',
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
    $rootScope.showBanner = true;
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
    $scope.submitrequest = function () {
        console.log('Submitting Request');
        var requesttopost = {
            org: $scope.newrequest.org,
            posOrgAbbr: $scope.newrequest.posOrgAbbr,
            userid: $scope.newrequest.userid,
            enabled: $scope.newrequest.enabled,
            state: $scope.newrequest.state,
            firstName: $scope.newrequest.firstName,
            lastName: $scope.newrequest.lastName,
            middleI: $scope.newrequest.middleI,
            empType: $scope.newrequest.empType,
            comments: $scope.newrequest.comments,
            requestType: $scope.newrequest.requestType,
            selectedRoles: '"' + $scope.newrequest.selectedRoles + '"',
            assignedTo: 'buzzi321@gmail.com'
        };
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


angular.module('myApprovalsApp').controller('RootController', ['$scope', '$rootScope', '$mdBottomSheet', '$mdSidenav', '$mdDialog', function ($scope,$rootScope, $mdBottomSheet, $mdSidenav, $mdDialog) {
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };
    $rootScope.showNav = false;
    $scope.menu = [
        {
            link: '',
            title: 'Dashboard',
            icon: 'dashboard'
        },
        {
            link: '',
            title: 'Create Tech',
            icon: 'group'
        },
        {
            link: '',
            title: 'Search',
            icon: 'search'
        }
    ];
    $scope.admin = [
        {
            link: '',
            title: 'Trash',
            icon: 'delete'
        },
        {
            link: 'showListBottomSheet($event)',
            title: 'Settings',
            icon: 'settings'
        }
    ];

    $scope.alert = '';


    $scope.showAdd = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="user.firstName" placeholder="Placeholder text"> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="theMax"> </md-input-container> </div> <md-input-container flex> <label>Address</label> <input ng-model="user.address"> </md-input-container> <div layout layout-sm="column"> <md-input-container flex> <label>City</label> <input ng-model="user.city"> </md-input-container> <md-input-container flex> <label>State</label> <input ng-model="user.state"> </md-input-container> <md-input-container flex> <label>Postal Code</label> <input ng-model="user.postalCode"> </md-input-container> </div> <md-input-container flex> <label>Biography</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </div></md-dialog>',
            targetEvent: ev
        })
            .then(function (answer) {
                $scope.alert = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.alert = 'You cancelled the dialog.';
            });
    };
}]);

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}



