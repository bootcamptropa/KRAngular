(function (app) {
    app.config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('root.product', {
                    url: '/product',
                    parent: 'root',
                    views: {
                        "container@": {
                            controller: 'ProductController',
                            templateUrl: 'product/product.tpl.html'
                        }
                    },
                    data: {
                        pageTitle: 'Product'
                    }
                })
                .state('root.addproduct', {
                    url: '/product/add',
                    parent: 'root',
                    views: {
                        "container@": {
                            controller: 'ProductAddController',
                            templateUrl: 'product/addproduct.tpl.html'
                        }
                    },
                    data: {
                        pageTitle: 'Product'
                    }
                });
        }]);

    app.controller('ProductController', ['$scope', '$log', '$state','NgMap', function ($scope, $log, $state,NgMap) {
        $log.info('App:: Starting CustomerController');
        var init = function () {
            $scope.model = {};
            $scope.model.pageTitle = $state.current.data.pageTitle;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = true;
            var slides = $scope.slides = [];
            $scope.addSlide = function() {
                var newWidth = 600 + slides.length + 1;
                slides.push({
                    image: '//lorempixel.com/' + newWidth + '/400/animals',
                    text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                    ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
                });
            };
            for (var i=0; i<10; i++) {
                $scope.addSlide();
            }
            NgMap.getMap().then(function(map) {
                $log.debug(map.getCenter());
                $log.debug('markers', map.markers);
                $log.debug('shapes', map.shapes);
            });
        };

        init();

    }]);

    app.controller('ProductAddController', ['$scope', '$log', '$state','NgMap', function ($scope, $log, $state,NgMap) {
        $log.info('App:: Starting CustomerController');
        var init = function () {
            $scope.model = {};
            $scope.model.pageTitle = $state.current.data.pageTitle;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;
            var slides = $scope.slides = [];
            $scope.addSlide = function() {
                var newWidth = 600 + slides.length + 1;
                slides.push({
                    image: '//lorempixel.com/' + newWidth + '/400/animals',
                    text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                    ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
                });

                //Multiselect
                $scope.example5model = []; $scope.example5data = [ {id: 1, label: "Chiwawa"}, {id: 2, label: "American Standford"}, {id: 3, label: "Doberman"}]; $scope.example5settings = {}; $scope.example5customTexts = {buttonDefaultText: 'Cual es la raza de tu perro?'};
            };
            for (var i=0; i<10; i++) {
                $scope.addSlide();
            }
            NgMap.getMap().then(function(map) {
                $log.debug(map.getCenter());
                $log.debug('markers', map.markers);
                $log.debug('shapes', map.shapes);
            });
        };

        init();

    }]);

}(angular.module("KRAngular.product", [
    'ui.router',
    'globalService',
    'productService',
    'ngMap'
])));