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

    app.controller('uprofileController', ['$scope', '$log','$state','userProductsService','uTransactionsService',
        function ($scope, $log,$state,userProductsService,uTransactionsService) {
        $log.info('App:: Starting uprofileController');

        var init = function () {
            $scope.model = {};
            $scope.model.pageTitle = $state.current.data.pageTitle;
        };

        $scope.getSellingProducts = function(){
            userProductsService.getUserProducts().then(function(data){
                $log.info(data);
                $scope.model = data;
            },function(err){
                $log.info(err);
            });
        };

        $scope.getUserTransactions = function(){
            uTransactionsService.getTransactions().then(function(data){
                $log.info(data);
                $scope.model = data;
            },function(err){

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