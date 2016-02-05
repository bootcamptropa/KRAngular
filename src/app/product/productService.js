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
                            getObject: {
                                timeout: 15000,
                                method: 'GET',
                                isArray:false
                            },
                            put: {
                                timeout: 15000,
                                method: 'PUT'
                            }
                        });
                    },
                    getAction: function (race,category,lat,lon,distance) {
                        var def = $q.defer();
                        var paramList = {};
                        if (race){
                            paramList.race = race;
                        }
                        if (category){
                            paramList.category = category;
                        }
                        if (lat){
                            paramList.lat = lat;
                        }
                        if (lon){
                            paramList.lon = lon;
                        }
                        if (distance){
                            paramList.distance = distance;
                        }

                        this.api('/products/').get(paramList, {}, function (data) {
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    },
                    getProduct: function (productId) {
                        var def = $q.defer();
                        this.api('/products/'+productId+"/").get({}, {}, function (data) {
                            def.resolve(data);
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    },
                    saveTransaction: function(idProduct){
                        var postData = {
                            product: idProduct
                        };
                        var def = $q.defer();
                        this.api('/transactions/').save({},postData,function(data){
                            def.resolve(data);
                        },function(err){
                            def.reject(err);
                        });
                        return def.promise;
                    },
                    getCustomer: function () {
                        var def = $q.defer();
                        this.api().get({}, {}, function (data) {
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



