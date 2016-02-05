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


    app.controller('HomeController', ['$scope','$log', 'productsService','$state','globalService','load_data','$rootScope',
        function ($scope,$log, productsService,$state,globalService,load_data,$rootScope) {

        var init = function () {
            $log.info('App:: Starting HomeController');
            $rootScope.domReady=false;

            $scope.model={};
            $scope.model.pageTitle=$state.current.data.pageTitle;

            $scope.maxSize = 4;
            $scope.bigCurrentPage = 1;
            $scope.currentPage = 1;
            $scope.itemsPerPage = ITEMS_PER_PAGE;

            var latitude = globalService.getStorageItem('latitude');
            var longitude = globalService.getStorageItem('longitude');

            if (typeof latitude === 'object') {
                latitude=null;
            }
            if (typeof longitude === 'object') {
                longitude=null;
            }

            getProducts(null,null,latitude,longitude,null,0);

            var race_search = null;
            var distance_search = null;

            // listen for the event in the relevant $scope
            $rootScope.$on('newSearch', function (event, data) {
                $log.info('Evento de nueva busqueda'); // 'Data to send'
                $log.info(data);

                if (data.search.distance){
                    distance_search = data.search.distance.id;
                }

                if (data.search.race){
                    race_search = data.search.race.id;
                }

                getProducts(race_search,null,latitude,longitude,distance_search,0);
            });

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function() {
                $log.log('Page changed to: ' + $scope.bigCurrentPage);
                $scope.setPage($scope.bigCurrentPage);
                $rootScope.domReady = true;
                getProducts(race_search,null,latitude,longitude,distance_search,(($scope.bigCurrentPage - 1) * $scope.itemsPerPage));
                $rootScope.domReady = false;
            };
        };

        function getProducts(race, category, latitude, longitude, distance, offset)
        {
            productsService.getProducts(race, category, latitude, longitude, distance, offset, $scope.itemsPerPage).then(function (data) {
                $rootScope.domReady = true;
                $scope.products = data.results;
                $scope.bigTotalItems = data.count;
            });
        }

        init();
    }]);

}(angular.module("KRAngular.home", [
    'ui.router',
    'productsService',
    'globalService'
])));