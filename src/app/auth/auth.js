(function (app) {
    app.config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('root.auth', {
                    url: '/auth',
                    parent: 'root',
                    views: {
                        "container@": {
                            controller: 'AuthController',
                            templateUrl: 'auth/auth.tpl.html'
                        }
                    },
                    data: {
                        pageTitle: 'Auth'
                    }
                })
                .state('root.logout', {
                    url: '/auth/logout',
                    parent: 'root',
                    views: {
                        "container@": {
                            controller: 'LogoutController',
                            templateUrl: 'auth/logout.tpl.html'
                        }
                    },
                    data: {
                        pageTitle: 'Logout'
                    }
                });
        }]);

    app.controller('AuthController', ['$scope', '$log', '$state','authService','globalService','loginsService','$rootScope',
        function ($scope, $log, $state,authService,globalService,loginsService,$rootScope) {
            $log.info('App:: Starting AuthController');
            var init = function () {
                $scope.model = {};
                $scope.err = {};
                $scope.err2 = {};
                $scope.err.visible=false;
                $scope.err2.visible=false;
                $scope.model.pageTitle = $state.current.data.pageTitle;
            };

            var setMsg = function(errDiv,errData,errMsg){
                errDiv.visible=true;
                errDiv.error=errMsg;
                errDiv.error_description=JSON.stringify(errData);
            };

            $scope.onKeyPressLogin = function($event) {
                if ($event.keyCode == 13) {
                    $scope.doLoginOAuth2();
                }
            };

            $scope.onKeyPressRegister = function($event) {
                if ($event.keyCode == 13) {
                    $scope.doRegister();
                }
            };

            $scope.clearErrors = function(){
                $scope.err.visible=false;
                $scope.err.error='';
                $scope.err.error='';
                $scope.err2.visible=false;
                $scope.err2.error='';
                $scope.err2.error='';
            };

            $scope.doRegister = function(){
                var long = globalService.getStorageItem('longitude');
                var lati = globalService.getStorageItem('latitude');

                if (typeof long !== "number") {
                    long = 0;
                }
                if (typeof lati !== "number") {
                    lati = 0;
                }

                var registerData = {
                    username:$scope.rusername,
                    password:$scope.rpassword,
                    password2:$scope.rpassword2,
                    first_name:$scope.rfirstname,
                    last_name:$scope.rlastname,
                    email:$scope.remail,
                    longitude:long,
                    latitude:lati,
                    token_facebook:0,
                    //TODO: avatar_url no debe ser obligatoria en el api.
                    avatar_url:"http://walladog.com/assets/logos/walladogt.png"
                };

                if ($scope.rpassword !== $scope.rpassword2){
                    $scope.err.visible = true;
                    $scope.err.error = 'Error en el registro:';
                    $scope.err.error_description = 'Las contraseñas no coinciden';
                } else if ($scope.remail !== $scope.remail2){
                    $scope.err.visible = true;
                    $scope.err.error = 'Error en el registro:';
                    $scope.err.error_description = 'Los e-mail no coinciden';
                } else {
                    authService.doRegister(registerData).then(function (data) {
                        setMsg($scope.err, 'Registro exitoso', false);
                        var loginData = {
                            username: $scope.rusername,
                            password: $scope.rpassword
                        };
                        authService.doLoginOAuth2(loginData).then(function (data) {
                            if (data.access_token && data.refresh_token) {
                                loginsService.getUserInfo().then(function (dataCustomer) {
                                    $rootScope.uData.avatar = dataCustomer.avatar_url;
                                    $rootScope.uData.email = dataCustomer.email;
                                    $rootScope.uData.firstName = dataCustomer.first_name;
                                    $rootScope.uData.lastName = dataCustomer.last_name;
                                    $rootScope.uData.userId = dataCustomer.id;
                                    $rootScope.uData.userName = dataCustomer.username;
                                    $rootScope.uData.isLogged = true;

                                    globalService.setStorageItem('lcookier', true);
                                    globalService.setStorageItem('ucookier', dataCustomer.username);

                                    $state.go('root.uprofile');
                                }, function (errCustomer) {
                                    $log.warn(errCustomer);
                                    $scope.err2.visible = true;
                                    $scope.err2.error = 'Error en el registro:';
                                    $scope.err2.error_description = JSON.stringify(errCustomer.data);
                                });
                            }
                        }, function (err) {
                            $log.warn(err);
                            $scope.err2.visible = true;
                            $scope.err2.error = 'Error al identificarte:';
                            $scope.err2.error_description = JSON.stringify(err.data);
                        });

                    }, function (err) {
                        setMsg($scope.err, err.data, 'Error en el registro');
                    });
                }
            };

            $scope.doLoginOAuth2 = function(){
                var loginData = {
                    username:$scope.username,
                    password:$scope.password
                };
                authService.doLoginOAuth2(loginData).then(function(data){
                    if(data.access_token && data.refresh_token){
                        loginsService.getUserInfo().then(function(dataCustomer){
                            $rootScope.uData.avatar=dataCustomer.avatar_url;
                            $rootScope.uData.email=dataCustomer.email;
                            $rootScope.uData.firstName=dataCustomer.first_name;
                            $rootScope.uData.lastName=dataCustomer.last_name;
                            $rootScope.uData.userId=dataCustomer.id;
                            $rootScope.uData.userName=dataCustomer.username;
                            $rootScope.uData.isLogged=true;

                            globalService.setStorageItem('lcookier',true);
                            globalService.setStorageItem('ucookier',dataCustomer.username);

                            $state.go('root.uprofile');
                        },function(errCustomer){
                            $log.warn(errCustomer);
                            $scope.err2.visible=true;
                            $scope.err2.error='Error en el registro:';
                            $scope.err2.error_description=JSON.stringify(errCustomer.data);
                        });
                    }
                },function(err){
                    $log.warn(err);
                    $scope.err2.visible=true;
                    $scope.err2.error='Error al identificarte:';
                    $scope.err2.error_description=JSON.stringify(err.data);
                });
            };


            init();

        }]);

    app.controller('LogoutController', ['$scope', '$log', '$state', '$stateParams','$rootScope','globalService',
        function ($scope, $log, $state, $stateParams,$rootScope,globalService) {
            var init = function () {
                $scope.model = {};
                $scope.model.pageTitle = $state.current.data.pageTitle;

                $rootScope.uData.avatar=false;
                $rootScope.uData.email=false;
                $rootScope.uData.firstName=false;
                $rootScope.uData.lastName=false;
                $rootScope.uData.userId=false;
                $rootScope.uData.userName=false;
                $rootScope.uData.isLogged=false;

                globalService.removeStorage('wcookie');
                globalService.removeStorage('wcookier');
                globalService.removeStorage('lcookier');
                globalService.removeStorage('ucookier');

            };

            $scope.goHome = function() {
                $state.go("root.home");
            };

            init();
        }]);

}(angular.module("KRAngular.auth", [
    'ui.router',
    'globalService',
    'authService',
    'globalService',
    'loginsService'
])));