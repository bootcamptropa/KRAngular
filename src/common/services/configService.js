/**
 * Created by hadock on 6/12/15.
 */

angular.module('configService', [])
    .factory('configService', ['$resource', '$q','$rootScope','$log','globalService',
        function ($resource, $q,$rootScope,$log,globalService) {
            return {
                setUpInitVars: function(){
                    $rootScope.domReady = false;
                    $rootScope.showCameraIcon = false;
                    $rootScope.uData = {
                        isLogged:false,
                        wcookie:false,
                        wcookier:false,
                        userId:false,
                        userName:'Identificate',
                        csrftoken:false,
                        firstName:false,
                        lastnNme:false,
                        email:false,
                        avatar:false

                    };

                    var wtoken = globalService.getStorageItem('wcookie');
                    var wtoken2 = globalService.getStorageItem('wcookier');

                    if(wtoken && wtoken2){
                        $rootScope.uData.wcookie = wtoken;
                        $rootScope.uData.wcookier = wtoken2;
                    }
                },
                setUpMessages: function(){
                    $rootScope.aMessages = {
                        loading : 'Cargando página, espera unos segundos...',
                        error : 'Ha ocurrido un error',
                        apiError : 'Error de conexion, comprueba tu conexión a internet.'
                    };
                }
            };
        }]);



