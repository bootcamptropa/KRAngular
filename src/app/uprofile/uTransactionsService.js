/* 
 * Api Test Módule
 */
angular.module('uTransactionsService', [])
        .factory('uTransactionsService', ['$resource', '$q', '$log',
            function ($resource, $q, $log) {
                return {
                    api: function (extra_route) {
                        if (!extra_route) {
                            extra_route = '';
                        }
                        return $resource(API_URL + '/transactions/' + extra_route, {}, {
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
                    getTransactions: function () {
                        //Service action with promise resolve (then)
                        var def = $q.defer();
                        this.api().get({}, {}, function (data) {
                            $log.warn('Api::data:: ');
                            $log.warn(data);

                            def.resolve(data);
                        }, function (err) {
                            def.reject(err,def.promise);
                        });
                        return def.promise;
                    },
                    updateTransaction: function(postData){
                        var def = $q.defer();
                        this.api().put({}, postData, function (data) {
                            $log.warn('Api::data:: ');
                            $log.warn(data);
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    },
                    postTransaction: function (postData) {
                        var def = $q.defer();
                        this.api().save({}, postData, function (data) {
                            $log.warn('Api::data:: ');
                            $log.warn(data);
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    }
                };
            }]);



