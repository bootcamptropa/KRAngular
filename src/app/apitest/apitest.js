(function (app) {
    app.config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                    .state('root.apitest', {
                        url: '/apitest',
                        parent: 'root',
                        views: {
                            "container@": {
                                controller: 'ApitestController',
                                templateUrl: 'apitest/apitest.tpl.html'
                            }
                        },
                        data: {
                            pageTitle: 'Apitest'
                        }
                    });                               
        }]);

    app.controller('ApitestController', ['$scope','$log', 'apitestService','$state', function ($scope,$log, apitestService,$state) {
            $scope.myjson={};

            var init = function () {
                $log.info('App:: Starting ApitestController');
                
                $scope.model={};
                $scope.model.pageTitle=$state.current.data.pageTitle;
                
                

                $scope.postAction = function(){
                    apitestService.postAction().then(function (data) {
                        $scope.myjson=data;
                    });
                };

                $scope.getAction = function(){
                    apitestService.getAction().then(function (data) {
                        $scope.myjson=data;
                    });
                };

                $scope.postTransaction = function(postData){
                    apitestService.postTransaction(postData).then(function(data){
                        $log.info(data);
                    },function(err){
                        $log.info(err);
                    });
                };
                $scope.getTransactions = function(postData){
                    apitestService.getTransactions().then(function(data){
                        $log.info(data);
                    },function(err){
                        $log.info(err);
                    });
                };


            };
            init();
        }]);

}(angular.module("KRAngular.apitest", [
    'ui.router',
    'apitestService'
])));