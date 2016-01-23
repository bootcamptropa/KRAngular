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
                    data: {
                        pageTitle: 'uprofile'
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

    app.controller('uprofileController', ['$scope', '$log','$state','userProductsService','uTransactionsService','$filter',
        function ($scope, $log,$state,userProductsService,uTransactionsService,$filter) {
            $log.info('App:: Starting uprofileController');

            var init = function () {
                $scope.model = {};
                clearModels();
                $scope.upLoading = false;
                $scope.upTitle = 'Perfil de Usuario';
                $scope.model.pageTitle = $state.current.data.pageTitle;
                $scope.getSellingProducts();
            };

            var clearModels = function(){
                $scope.modelSelling = {};
                $scope.modelSold = {};
                $scope.modelTransactions = {};
                $scope.modelUser = {};
            };

            $scope.getSellingProducts = function(){
                clearModels();
                $scope.upLoading=true;
                $scope.upTitle='En venta';
                userProductsService.getUserProducts().then(function(data){
                    $log.info(data);
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
                    $log.info(data);
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
                    $log.info(data);
                    $scope.modelTransactions = data;
                    $scope.upLoading = false;
                },function(err){
                    $scope.upLoading = false;
                });
            };

            init();
        }]);

}(angular.module("KRAngular.uprofile", [
    'ui.router',
    'productsService',
    'userProductsService',
    'uTransactionsService'
])));