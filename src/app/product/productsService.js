/* 
 * Api Test Módule
 */
angular.module('productsService', [])
    .factory('productsService', ['$resource', '$q', '$log',
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
                            method: 'POST',
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        },
                        put:{
                            timeout: 15000,
                            method: 'PUT'
                        },
                        get: {
                            timeout: 15000,
                            method: 'GET'
                        },
                        delete: {
                            timeout: 15000,
                            method: 'DELETE'
                        },
                        getOne: {
                            timeout: 15000,
                            method: 'GET'
                        }
                    });
                },
                myFunction: function(){
                    alert('hola');
                },
                getProducts: function (race,category,lat,lon,distance,offset,limit) {
                    //Service action with promise resolve (then)
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

                    this.api('?limit='+limit+'&offset='+offset).get(paramList, {}, function (data) {
                        def.resolve(data);
                    }, function (err) {
                        def.reject(err);
                    });
                    return def.promise;
                },
                getOneProduct: function(id){
                    var def = $q.defer();
                    this.api(id+'/').getOne({},{},function(data){
                        def.resolve(data);
                    },function(err){
                        def.reject(err);
                    });
                    return def.promise;
                },
                saveProduct: function(id,data){
                    var postData = {
                        name:data.name,
                        description:data.description,
                        price:data.price,
                        category:data.categoryid,
                        race:data.raceid,
                        sterile:data.sterile,
                        gender:data.gender,
                        state:data.stateid
                    };

                    var def = $q.defer();
                    this.api(id+'/').put({},postData,function(data){
                        def.resolve(data);
                    },function(err){
                        def.reject(err);
                    });
                    return def.promise;
                },
                deleteProduct: function(id){
                    var def = $q.defer();
                    this.api(id+'/').delete({},{},function(data){
                        def.resolve(data);
                    },function(err){
                        def.reject(err);
                    });
                    return def.promise;
                },
                newProduct: function(data,files,geodata){
                    var postData = {
                        name:data.name,
                        description:data.description,
                        price:data.price,
                        category:data.categoryid
                    };

                    if (data.race !== undefined){
                        postData.race = data.race;
                    }
                    if (data.sterile !== undefined){
                        postData.sterile = data.sterile;
                    }
                    if (data.gender !== undefined){
                        postData.gender = data.gender;
                    }

                    var def = $q.defer();
                    console.log(geodata);

                    var fd = new FormData();
                    for(var key in postData){
                        fd.append(key,data[key]);
                    }

                    if(files){
                        var i = 0;
                        for(i=0;i<files.length;i++){
                            fd.append('upload_image',files[i]);
                        }
                    }


                    //fd.append('upload_image',files);
                    if(geodata.latitude && geodata.longitude){
                        console.log('adding geo');
                        console.log(geodata);
                        fd.append('longitude',parseFloat(geodata.longitude));
                        fd.append('latitude',parseFloat(geodata.latitude));
                    }else{
                        fd.append('longitude',parseFloat(DEFAULT_LONGITUDE));
                        fd.append('latitude',parseFloat(DEFAULT_LATITUDE));
                    }

                    this.api().save({},fd,function(data){
                        def.resolve(data);
                    },function(err){
                        def.reject(err);
                    });
                    return def.promise;
                }

            };
        }]);



