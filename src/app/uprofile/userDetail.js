/**
 * api test
 */
angular.module('userDetail', [])
    .factory('userDetail', ['$resource', '$q', '$log',
        function ($resource, $q, $log) {
            return {
                api: function (extra_route) {
                    if (!extra_route) {
                        extra_route = '';
                    }
                    return $resource(API_URL + '/users/' + extra_route + "/", {}, {
                        stripTrailingSlashes: false,
                        query: {
                            timeout: 15000,
                            method: 'GET',
                            isArray: true
                        },
                        save: {
                            timeout: 15000,
                            method: 'POST'
                        },
                        put: {
                            timeout: 15000,
                            method: 'PUT',
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        },
                        get: {
                            timeout: 15000,
                            method: 'GET'
                            //isArray: true
                        }
                    });
                },
                getUser: function (idUser) {
                    //Service action with promise resolve (then)
                    var def = $q.defer();
                    $log.info("idUser:: ",idUser);
                    this.api(idUser).get({}, {}, function (data) {
                        //$log.info("data:: ",data);
                        def.resolve(data);
                    }, function (err) {
                        def.reject(err,def.promise);
                    });
                    return def.promise;
                },
                updateUser: function(idUser,postData){
                    var def = $q.defer();
                    this.api(idUser).put({}, postData, function (data) {
                        def.resolve(data);
                    }, function (err) {
                        def.reject(err);
                    });
                    return def.promise;
                }
            };
        }]);

