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
                        image: '//placekitten.com/' + newWidth + '/300',
                        text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
                    });
                };
                for (var i=0; i<4; i++) {
                    $scope.addSlide();
                }
                NgMap.getMap().then(function(map) {
                    console.log(map.getCenter());
                    console.log('markers', map.markers);
                    console.log('shapes', map.shapes);
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