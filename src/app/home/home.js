(function (app) {
    app.config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('root.home', {
                    url: '/',
                    parent: 'root',
                    views: {
                        "container@": {
                            controller: 'HomeController',
                            templateUrl: 'home/home.tpl.html'
                        }
                    },
                    resolve:{

                    },
                    data: {
                        pageTitle: 'Home'
                    }
                });
        }]);


    app.controller('HomeController', ['$scope','$log', 'productService','$state','globalService','load_data','$rootScope',
        function ($scope,$log, productService,$state,globalService,load_data,$rootScope) {

        var init = function () {
            $log.info('App:: Starting HomeController');
            $rootScope.domReady=false;

            $scope.model={};
            $scope.model.pageTitle=$state.current.data.pageTitle;

            var latitude = globalService.getStorageItem('latitude');
            var longitude = globalService.getStorageItem('longitude');

            productService.getAction(null,null,latitude,longitude,null).then(function(data){
                $rootScope.domReady=true;
                $scope.products = data;
            });

            // listen for the event in the relevant $scope
            $rootScope.$on('newSearch', function (event, data) {
                $log.info('Evento de nueva busqueda'); // 'Data to send'
                $log.info(data);

                if (!data.search.distance){
                    data.search.distance = {};
                    data.search.distance.id = null;
                }

                if (!data.search.race){
                    data.search.race = {};
                    data.search.race.id = null;
                }

                productService.getAction(data.search.race.id,null,latitude,longitude,data.search.distance.id).then(function(data){
                    console.log(data);
                    $rootScope.domReady=true;
                    $scope.products = data;
                });
            });

        };

        init();
    }]);

}(angular.module("KRAngular.home", [
    'ui.router',
    'productService',
    'globalService'
])));