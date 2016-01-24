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
                        load_data: (['globalService','$stateParams', '$q', '$log','$filter', function (globalService, $stateParams, $q, $log,$filter) {
                            $log.warn('Home::ResolveData::');
                            $log.info($stateParams);
                            var geo = globalService.getGeolocalization();
                            return $q.all([geo]);
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

            $scope.model={};
            $scope.model.pageTitle=$state.current.data.pageTitle;

            var geo = load_data[0];

            productService.getAction(1,1,geo.coords.latitude,geo.coords.longitude).then(function(data){
                console.log(data);
                $scope.products = data;
            });

            // listen for the event in the relevant $scope
            $rootScope.$on('newSearch', function (event, data) {
                $log.info('Evento de nueva busqueda'); // 'Data to send'
                $log.info(data);
            });

        };

        init();
    }]);

}(angular.module("KRAngular.home", [
    'ui.router',
    'productService',
    'globalService'
])));