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

                        // http://api.walladog.com/api/1.0/products/1
                        return $resource(API_URL  + extra_route, {}, {

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
                    getAction: function (race,category,lat,lon,words,distance) {
                        var def = $q.defer();
                        var paramlist = {
                            race:race,
                            category:category,
                            lat:lat,
                            lon:lon,
                            words:words,
                            distance:distance
                        };
                        this.api('/products/').get(paramlist, {}, function (data) {
                            $log.warn('Api::data:: ');
                            $log.warn(data);
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    },
                    getProduct: function (productId) {
                        var def = $q.defer();
                        this.api('/products/'+productId+"/").get({}, {}, function (data) {
                            $log.warn('Api::data:: ');
                            $log.warn(data);
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    },
                    getCustomer: function () {
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



