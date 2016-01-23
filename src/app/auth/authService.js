/* 
 * AuthService Módule
 */
angular.module('authService', [])
    .factory('authService', ['$resource', '$q', '$log','globalService','$rootScope',
        function ($resource, $q, $log,globalService,$rootScope) {
            return {
                api: function (extra_route,extra_data,api_endpoint,isOAUTH) {
                    if (!extra_route) {
                        extra_route = '';
                    }
                    var API_URL_VAR = API_URL;
                    if(isOAUTH){
                        API_URL_VAR = API_URL_OAUTH;
                    }

                    return $resource(API_URL_VAR + api_endpoint + extra_route, {}, {
                        query: {
                            timeout: 15000
                        },
                        save: {
                            timeout: 15000,
                            method: 'POST'
                        },
                        get: {
                            timeout: 15000,
                            method: 'GET'
                        },
                        put: {
                            timeout: 15000,
                            method: 'PUT'
                        },
                        postOauth2Login: {
                            timeout: 15000,
                            method: 'POST',
                            headers:{'Authorization':'Basic '+extra_data},
                            withCredentials: false
                        },
                        postOauth2RefreshToken: {
                            timeout: 15000,
                            method: 'POST',
                            headers:{'Authorization':'Basic '+extra_data},
                            withCredentials: false
                        }
                    });
                },
                doLoginOAuth2: function(loginData){
                    var postDataToSend={
                        grant_type:'password',
                        username:loginData.username,
                        password:loginData.password,
                        scope:'read write'
                    };
                    var def = $q.defer();
                    var aHeader = globalService.base64Encode(CID+':'+CSE);
                    this.api(false,aHeader,'/o/token/',true).postOauth2Login(postDataToSend, {}, function (data) {
                        if(data.access_token && data.refresh_token) {
                            $rootScope.uData.wcookie = data.access_token;
                            $rootScope.uData.wcookier = data.refresh_token;
                            globalService.setStorageItem('wcookie',data.access_token);
                            globalService.setStorageItem('wcookier',data.refresh_token);
                            def.resolve(data);
                        }else{
                            $log.info('No token recived from oAuth Server');
                        }

                    }, function (err) {
                        def.reject(err);
                    });
                    return def.promise;
                },
                doLoginWithRefreshToken: function(){
                    var postDataToSend={
                        grant_type:'refresh_token',
                        client_id:CID,
                        client_secret:CSE,
                        refresh_token:$rootScope.uData.wcookier
                    };
                    var def = $q.defer();
                    var aHeader = globalService.base64Encode(CID+':'+CSE);
                    this.api(false,aHeader,'/o/token/',true).postOauth2RefreshToken(postDataToSend, {}, function (data) {
                        $log.warn('REFRESH TOKEN');
                        $log.warn(data);
                        def.resolve(data);
                        if(data.access_token && data.refresh_token){
                            globalService.setStorageItem('wcookie',data.access_token);
                            globalService.setStorageItem('wcookier',data.refresh_token);
                            $rootScope.uData.wcookie = data.access_token;
                            $rootScope.uData.wcookier = data.refresh_token;
                            $log.info($rootScope.uData);
                        }
                    }, function (err) {
                        def.reject(err);
                    });
                    return def.promise;
                },
                doLogout: function (postData) {
                    var def = $q.defer();
                    this.api().post({}, postData, function (data) {
                        def.resolve(data);
                    }, function (err) {
                        def.reject(err);
                    });
                    return def.promise;
                },
                doRegister: function(postData){
                    var def = $q.defer();
                    this.api(false,null,'/users/',false).save({}, postData, function (data) {
                        def.resolve(data);
                    }, function (err) {
                        def.reject(err);
                    });
                    return def.promise;
                }
            };
        }]);



