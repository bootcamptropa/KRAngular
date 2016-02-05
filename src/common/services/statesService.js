/* 
 * Api Test Módule
 */
angular.module('statesService', [])
        .factory('statesService', ['$resource', '$q', '$log',
            function ($resource, $q, $log) {
                return {
                    api: function (extra_route) {
                        if (!extra_route) {
                            extra_route = '';
                        }
                        return $resource(API_URL + '/states/' + extra_route, {}, {
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
                            get: {
                                timeout: 15000,
                                method: 'GET',
                                isArray: true
                            }
                        });
                    },
                    getStates: function () {
                        //Service action with promise resolve (then)
                        var def = $q.defer();
                        this.api().get({}, {}, function (data) {
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err,def.promise);
                        });
                        return def.promise;
                    }
                };
            }]);



