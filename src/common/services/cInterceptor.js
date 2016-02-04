/*
 * Intercept all requests /responses
 * Ej. use to auth-tokens in headers
 * 8fFuDe802ATWovY9eL4xGojWXgmBb9
 */

angular.module('cInterceptor', [])
    .factory('cInterceptor', ['$q', '$rootScope','$injector','$log', function ($q, $rootScope,$injector,$log) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                $rootScope.customHeader = sessionStorage.getItem(CUSTOM_HEADER);

                if(!config.headers['Authorization']) {
                    if ($rootScope.uData.wcookie && Object.keys($rootScope.uData.wcookie).length>0) {
                        if(config.headers['Content-Type']===undefined){
                            config.headers = {
                                'Content-Type': undefined,
                                'Authorization': 'Bearer ' + $rootScope.uData.wcookie
                            };
                        }else{
                            config.headers = {
                                'Content-type': 'application/json;charset=UTF-8',
                                'Authorization': 'Bearer ' + $rootScope.uData.wcookie
                            };
                        }
                    }
                }

                if(USE_CUSTOM_HEADER) {
                    config.headers[CUSTOM_HEADER] = $rootScope.customHeader;
                }
                return config;
            },
            'response': function (response) {

                //Save data custom header to send in next request
                if (response.headers(CUSTOM_HEADER) !== null) {
                    $rootScope.customHeader = response.headers(CUSTOM_HEADER);
                    sessionStorage.setItem(CUSTOM_HEADER, response.headers(CUSTOM_HEADER));
                } else {
                    $rootScope.customHeader = sessionStorage.getItem(CUSTOM_HEADER);
                }
                response.headers('Allow', '*');
                return response;
            },
            'responseError': function (rejection,promise) {
                $log.debug('Reject::');
                $log.debug(rejection);
                var state = $injector.get('$state');

                if(rejection.status===401 && $rootScope.uData.wcookier){
                    if ($rootScope.uData.wcookier && Object.keys($rootScope.uData.wcookier).length>0) {
                        var authService = $injector.get('authService');
                        authService.doLoginWithRefreshToken().then(function(data){
                            if(data.access_token && data.refresh_token){
                                alert('Tu session ha caducado pero ya la hemos recuperado! , intenta de nuevo tu peticion.');
                            }
                        },function(err){
                            $log.warn(err);
                            var globalService = $injector.get('globalService');
                            globalService.clearStorage();
                        });
                    }else{
                        //state.go('root.auth');
                    }
                }else{
                    $log.warn('Error en la peticion interceptado');
                }
                return $q.reject(rejection);
            }
        };
    }
    ]);

