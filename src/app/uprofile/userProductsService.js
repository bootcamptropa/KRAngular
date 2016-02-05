/* 
 * Api Test Módule
 */
angular.module('userProductsService', [])
        .factory('userProductsService', ['$resource', '$q', '$log',
            function ($resource, $q, $log) {
                return {
                    api: function (extra_route) {
                        if (!extra_route) {
                            extra_route = '';
                        }
                        return $resource(API_URL + '/userProducts/' + extra_route, {}, {
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
                                method: 'PUT'
                            },
                            get: {
                                timeout: 15000,
                                method: 'GET',
                                isArray: true
                            }
                        });
                    },
                    getUserProducts: function () {
                        var queryString = {
                            offset:1,
                            limit:3,
                            state:1,
                            race:1,
                            category:1
                        };
                        queryString={};
                        var def = $q.defer();
                        this.api().get(queryString, {}, function (data) {
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err,def.promise);
                        });
                        return def.promise;
                    }
                };
            }]);



