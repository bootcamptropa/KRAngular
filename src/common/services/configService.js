/**
 * Created by hadock on 6/12/15.
 */

angular.module('configService', [])
    .factory('configService', ['$resource', '$q','$rootScope','$log','globalService','loginsService',
        function ($resource, $q,$rootScope,$log,globalService,loginsService) {
            return {
                setUpInitVars: function(){
                    $rootScope.domReady = false;
                    $rootScope.showCameraIcon = false;
                    this.clearUserData();


                    var wtoken = globalService.getStorageItem('wcookie');
                    var wtoken2 = globalService.getStorageItem('wcookier');

                    if(wtoken && wtoken2){
                        $rootScope.uData.wcookie = wtoken;
                        $rootScope.uData.wcookier = wtoken2;
                        var isLogged = globalService.getStorageItem('lcookier');
                        if(typeof isLogged !== 'object' && isLogged) {
                            this.getUserInfo();
                            $rootScope.showCameraIcon = true;
                        }
                    }

                },
                setUpMessages: function(){
                    $rootScope.aMessages = {
                        loading : 'Cargando página, espera unos segundos...',
                        error : 'Ha ocurrido un error',
                        apiError : 'Error de conexion, comprueba tu conexión a internet.'
                    };
                },
                clearUserData:function(){
                    $rootScope.uData = {
                        isLogged:false,
                        wcookie:false,
                        wcookier:false,
                        userId:false,
                        userName:false,
                        csrftoken:false,
                        firstName:false,
                        lastnNme:false,
                        email:false,
                        avatar:false

                    };
                },
                getUserInfo:function(){
                    var _this = this;
                    loginsService.getUserInfo().then(function(dataCustomer){
                        $rootScope.uData.avatar=dataCustomer.avatar_url;
                        $rootScope.uData.email=dataCustomer.email;
                        $rootScope.uData.firstName=dataCustomer.first_name;
                        $rootScope.uData.lastName=dataCustomer.last_name;
                        $rootScope.uData.userId=dataCustomer.id;
                        $rootScope.uData.userName=dataCustomer.username;
                        $rootScope.uData.isLogged=true;
                    },function(errCustomer){
                        $log.warn(errCustomer);
                        _this.clearUserData();
                    });
                }
            };
        }]);



