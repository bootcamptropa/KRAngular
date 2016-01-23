/* 
 * CustomerService Módule
 */
angular.module('productService', [])
        .factory('productService', ['$resource', '$q', '$log',
            function ($resource, $q, $log) {
                return {
                    api: function (extra_route) {
                        if (!extra_route) {
                            extra_route = '';
                        }
                        return $resource(API_URL + '/products/' + extra_route, {}, {
                            query: {
                                timeout: 15000,
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
                            },
                            put: {
                                timeout: 15000,
                                method: 'PUT'
                            }
                        });
                    },
                    getAction: function () {
                        var def = $q.defer();
                        this.api().get({}, {}, function (data) {
                            $log.warn('Api::data:: ');
                            $log.warn(data);
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    },
                    doLogin: function (postData) {
                        var def = $q.defer();
                        this.api().post({}, postData, function (data) {
                            def.resolve(data);
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
                    updateData: function(putData){
                        var def = $q.defer();
                        this.api().put({}, putData, function (data) {
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    }
                };
            }]);



