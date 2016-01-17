/* 
 * Api Test Módule
 */
angular.module('apitestService', [])
        .factory('apitestService', ['$resource', '$q', '$log',
            function ($resource, $q, $log) {
                return {
                    api: function (extra_route) {
                        if (!extra_route) {
                            extra_route = '';
                        }
                        return $resource(API_URL + '/products/' + extra_route, {}, {
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
                    getAction: function () {
                        //Service action with promise resolve (then)
                        var def = $q.defer();
                        this.api().get({}, {}, function (data) {
                            $log.warn('Api::data:: ');
                            $log.warn(data);

                            data.forEach(function(item){
                                console.log(item);
                            });

                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    },
                    postAction: function () {
                        //Service action with promise resolve (then)
                        var def = $q.defer();
                        this.api().save({}, {}, function (data) {
                            $log.warn('Api::data:: ');
                            $log.warn(data);
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    },
                    testFunction: function () {
                        alert('testFunction');
                    }
                };
            }]);



