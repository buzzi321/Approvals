angular.module('myApprovalsApp').factory('AuthService',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {

            // create user variable
            var user = null;
            //var profile = null;

            // return available functions for use in the controllers
            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register
            });

            function isLoggedIn() {
                if (user) {
                    return true;
                } else {
                    return false;
                }
            }

            function getUserStatus() {
                return $http.get('/user/status')
                    // handle success
                    .success(function (data) {
                        if (data.status) {
                            user = true;
                        } else {
                            user = false;
                        }
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                    });
            }

            function login(logindata) {

                // create a new instance of deferred
                var deferred = $q.defer();
                console.log('Entered AuthService.login');
                console.log('logindata:',logindata);

                // send a post request to the server
                $http.post('/verifyuser',
                    logindata)
                    // handle success
                    .success(function (data, status) {
                        console.log('AuthService Success', data,status);
                        if (status === 200 && data.status) {
                            user = true;

                            deferred.resolve(data);
                        } else {
                            user = false;
                            deferred.resolve(data);
                        }
                    })
                    // handle error
                    .error(function (data) {
                        console.log('AuthService Error', data);
                        user = false;
                        deferred.resolve(data);
                    });

                // return promise object

                return deferred.promise;


            }


            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/user/logout')
                    // handle success
                    .success(function (data) {
                        //$cookies.remove("username");
                        //$cookies.remove("profile");
                        user = false;
                        deferred.resolve();
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function register(registerdata) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/registeruser',
                    registerdata)
                    // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            deferred.resolve(data);
                        } else {
                            deferred.resolve(data);
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.resolve(data);
                    });

                // return promise object
                return deferred.promise;

            }

        }]);