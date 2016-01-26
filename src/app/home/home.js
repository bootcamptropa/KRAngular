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
                        load_data: (['globalService','$stateParams', '$q', '$log',
                            function (globalService, $stateParams, $q, $log) {
                            $log.warn('Home::ResolveData::');

                            globalService.getGeolocalization().then(function(data){
                                $log.info('Recuperadas coordenadas');
                                return $q.all([data]);
                            },function(err){
                                console.log(err);
                            });
                        }])
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

            $log.warn('Geolicalizacion: '+ load_data);

            var latitude = null;
            var longitude = null;
            if (load_data !== undefined && typeof Object.keys(load_data)[0] !== 'undefined'){
                $log.info('Geolocalizacion aceptada');
                latitude = load_data[0].coords.latitude;
                longitude = load_data[0].coords.longitude;
            }

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