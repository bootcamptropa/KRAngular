(function (app) {
    app.config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('root.uprofile', {
                    url: '/uprofile',
                    parent: 'root',
                    views: {
                        "container@": {
                            controller: 'uprofileController',
                            templateUrl: 'uprofile/uprofile.tpl.html'
                        }
                    },
                    resolve:{
                        load_data: (['userProductsService', '$q', '$log','$filter','uTransactionsService','racesService','$stateParams',
                            function (userProductsService, $q, $log,$filter,uTransactionsService,racesService,$stateParams) {
                                $log.warn('Uprofile::ResolveData::');
                                console.log($stateParams);
                                var pUsers = userProductsService.getUserProducts();
                                var uProducts2 = uTransactionsService.getTransactions();
                                var races = racesService.getRaces();
                                return $q.all([pUsers,uProducts2,races]);
                            }])
                    },
                    data: {
                        pageTitle: 'Perfil de Usuario'
                    }
                })
                .state('root.edituprofile', {
                    url: '/uprofile/editprofile',
                    parent: 'root',
                    views: {
                        "container@": {
                            controller: 'editUprofileController',
                            templateUrl: 'uprofile/edituprofile.tpl.html'
                        }
                    },
                    data: {
                        pageTitle: 'uprofile'
                    }
                });
        }]);

    app.controller('uprofileController', ['$scope', '$log','$state','userProductsService','uTransactionsService','$filter','load_data','userDetail','$rootScope',
        function ($scope, $log,$state,userProductsService,uTransactionsService,$filter,load_data,userDetail,$rootScope) {

            var init = function () {
                $scope.model = {};
                clearModels();
                calculateBadgets();
                $scope.modelSelling = $filter('filter')(load_data[0],{state:'Publicado'});
                $scope.upLoading = false;
                $scope.upTitle = 'Perfil de Usuario';
                $scope.model.pageTitle = $state.current.data.pageTitle;
                $scope.loaddata = {
                    states : [{id:1,name:'Publicado'},{id:2,name:'Vendido'},{id:3,name:'Cancelado'},{id:4,name:'Suspendido'}],
                    races : load_data[2],
                    gender : [{id:1,cod:'MAL',name:'Macho'},{id:2,cod:'FEM',name:'Hembra'},{id:3,cod:'NON',name:'Sin especificar'}],
                    sterile: [{id:1,name:'true'},{id:0,name:'false'}],
                    categories: [{id:1,name:'Perros'},{id:2,name:'Comida'},{id:3,name:'Ropa'},{id:4,name:'Accesorios'},{id:5,name:'Otros'}]
                };
            };

            var clearModels = function(){
                $scope.modelSelling = {};
                $scope.modelSold = {};
                $scope.modelTransactions = {};
                $scope.modelUser = {};
                $scope.modelUserActive = false;
            };

            var calculateBadgets = function(){
                var countSold = $filter('filter')(load_data[0],{state:'Vendido'}).length;
                var countSelling = $filter('filter')(load_data[0],{state:'Publicado'}).length;
                var countTrans = load_data[1].length;
                $scope.model.bselling = 0+parseInt(countSelling);
                $scope.model.bsold = 0+parseInt(countSold);
                $scope.model.btrans = 0+parseInt(countTrans);
                $scope.model.bnoti = 0;
            };

            $scope.getSellingProducts = function(){
                clearModels();
                $scope.upLoading=true;
                $scope.upTitle='En venta';
                userProductsService.getUserProducts().then(function(data){
                    var filtered = $filter('filter')(data,{state:'Publicado'});
                    $scope.modelSelling = filtered;
                    $scope.upLoading = false;
                },function(err){
                    $log.info(err);
                    $scope.upLoading = false;
                });
            };

            $scope.getSoldProducts = function(){
                clearModels();
                $scope.upLoading=true;
                $scope.upTitle='Vendidos';
                userProductsService.getUserProducts().then(function(data){
                    var filtered = $filter('filter')(data,{state:'Vendido'});
                    $scope.modelSold = filtered;
                    $scope.upLoading = false;
                },function(err){
                    $log.info(err);
                    $scope.upLoading = false;
                });
            };


            $scope.getUserTransactions = function(){
                clearModels();
                $scope.upLoading=true;
                $scope.upTitle='Transacciones';
                uTransactionsService.getTransactions().then(function(data){
                    $scope.modelTransactions = data;
                    $scope.upLoading = false;
                },function(err){
                    $scope.upLoading = false;
                });
            };

            $scope.getUserDetaills = function(){
                clearModels();
                $scope.upLoading=true;
                $scope.upTitle='Tus datos';
                userDetail.getUser($rootScope.uData.userId).then(function(data){
                    $scope.modelUser = data;
                    $scope.modelUserActive = true;
                    $scope.modelUser.subStatus = false;
                    $scope.modelUser.subText = "Submit";
                    $scope.upLoading = false;
                },function(err){
                    $scope.upLoading = false;
                });
            };

            init();
        }]);

    app.directive('productListUprofile',['productsService','$uibModal','$log',function(productsService,$uibModal,$log){
        return {
            restrict: "AE",
            templateUrl: "uprofile/productlistUprofile.tpl.html",
            replace: true,
            scope: {
                model: "=",
                loaddata: "=",
                onEdit: '&'
            },
            link: function (scope) {
                var _scope = scope;
                scope.editProductModal = function(id_product){
                    productsService.getOneProduct(id_product).then(function(data){
                        scope.data = {};
                        scope.data.product = data;
                        scope.data.loaddata = _scope.loaddata;
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'uprofile/modalEditProduct.tpl.html',
                            controller: 'ModalEditProductCtrl',
                            size: 'lg',
                            resolve: {
                                data: function(){
                                    return scope.data;
                                }
                            }
                        });

                        modalInstance.result.then(function (updatedProduct) {
                            scope.newProduct = updatedProduct;
                            console.log(scope.newProduct);
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                    },function(err){

                    });
                };
            }
        };

    }]);

    app.controller('ModalEditProductCtrl', function ($scope, $uibModalInstance, data,productsService) {
        $scope.data = data;
        $scope.actionMsg = '';

        $scope.isSterile = function(){
            if(data.product.sterile===true){
                return true;
            }else{
                return false;
            }
        };

        $scope.ok = function () {
            $scope.actionMsg = 'Updating selected product...';
            productsService.saveProduct(data.product.id,data.product).then(function(data){
                $scope.actionMsg = 'Product Updated!';
            },function(err){
                $scope.actionMsg = 'Error updating product:: '+err;
            });
            //$uibModalInstance.close($scope.product);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.directive('tusDatos',['$log','globalService','userDetail','$rootScope',function($log,globalService,userDetail,$rootScope){
        return {
            restrict: "AE",
            templateUrl: "uprofile/tusDatos.tpl.html",
            replace: true,
            scope: {
                model: "=",
                subusr: '&'
            },
            link: function (scope) {
                scope.updateUsr = function () {
                    $log.info(scope);

                    scope.model.subStatus = true;

                    var registerData = {
                        username:scope.model.username,
                        first_name:scope.model.first_name,
                        last_name:scope.model.last_name,
                        email:scope.model.email,
                        token_facebook:scope.model.token_facebook,
                        avatar_url:scope.model.avatar_url
                    };

                    var long = globalService.getStorageItem('longitude');
                    var lati = globalService.getStorageItem('latitude');
                    if (typeof long === "number") {
                        registerData["longitude"] = long;
                    }
                    if (typeof lati === "number") {
                        registerData["latitude"]  = lati;
                    }
                    //TODO: Password no debería ser obligatorio para actualizar.
                    if (scope.model.password1) {
                        registerData["password"]  = scope.model.password1;
                        registerData["password2"] = scope.model.password2;
                    }

                    userDetail.updateUser($rootScope.uData.userId,registerData).then(function(data){
                        scope.model.subText = "Datos Actualizados";
                    },function(err){
                        scope.model.subText = "Error "+err.status;
                    });

                };
            }
        };

    }]);


    app.filter("genders", function() {
        return function(gender) {
            if (gender == "NON") { return "Sin especificar"; }
            else if (gender == "MAL") { return "Macho"; }
            else if (gender == "FEM") { return "Hembra"; }
            else { return ""; }
        };
    });
    app.filter("boolVal", function() {
        return function(boolVal) {
            if(boolVal) {
                return "Si";
            } else  {
                return "No";
            }
        };
    });

}(angular.module("KRAngular.uprofile", [
    'ui.router',
    'productsService',
    'globalService',
    'userProductsService',
    'uTransactionsService',
    'userDetail',
    'statesService',
    'racesService'
])));