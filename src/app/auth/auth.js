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
                console.log('registro');
                var registerData = {
                    username:$scope.rusername,
                    password:$scope.rpassword,
                    password2:$scope.rpassword2,
                    first_name:$scope.firstname,
                    last_name:$scope.lastname,
                    email:$scope.remail
                };
                authService.doRegister(registerData).then(function(data){
                    console.log(data);
                    $scope.err.visible=true;
                    $scope.err.error='Registro efectuado con éxito:';
                    $scope.err.error_description=JSON.stringify(data);
                },function(err){
                    $scope.err.visible=true;
                    $scope.err.error='Error en el registro:';
                    $scope.err.error_description=JSON.stringify(err.data);
                });
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
                $rootScope.uData.userName='Identifícate';

                globalService.removeStorage('wcookie');
                globalService.removeStorage('wcookier');

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