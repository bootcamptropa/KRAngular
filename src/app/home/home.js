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
                        data: {
                            pageTitle: 'Home'
                        }
                    });                               
        }]);

    app.controller('HomeController', ['$log','$scope','$state','productService', function ($log,$scope,$state,productService) {

            var init = function () {
                $log.info('App:: Starting HomeController');
                $scope.model={};
                $scope.model.pageTitle=$state.current.data.pageTitle;

                productService.getAction().then(function(data){
                    console.log(data);
                    $scope.products = data;
                });

                $scope.photos = [
                    {id: '1', 'title': 'A nice day!', src: "http://lorempixel.com/200/190/animals"},
                    {id: '2', 'title': 'Puh!', src: "http://lorempixel.com/200/210/animals"},
                    {id: '3', 'title': 'What a club!', src: "http://lorempixel.com/200/201/animals"},
                    {id: '4', 'title': 'A nice day!', src: "http://lorempixel.com/200/185/animals"},
                    {id: '5', 'title': 'Puh!', src: "http://lorempixel.com/200/120/animals"},
                    {id: '6', 'title': 'What a club!', src: "http://lorempixel.com/200/150/animals"},
                    {id: '7', 'title': 'A nice day!', src: "http://lorempixel.com/200/210/animals"},
                    {id: '8', 'title': 'Puh!', src: "http://lorempixel.com/200/300/animals"},
                    {id: '9', 'title': 'What a club!', src: "http://lorempixel.com/200/175/animals"},
                    {id: '10', 'title': 'A nice day!', src: "http://lorempixel.com/200/190/animals"},
                    {id: '11', 'title': 'Puh!', src: "http://lorempixel.com/200/220/animals"},
                    {id: '12', 'title': 'What a club!', src: "http://lorempixel.com/200/211/animals"},
                    {id: '13', 'title': 'A nice day!', src: "http://lorempixel.com/200/202/animals"},
                    {id: '14', 'title': 'Puh!', src: "http://lorempixel.com/200/203/animals"},
                    {id: '15', 'title': 'What a club!', src: "http://lorempixel.com/200/205/animals"},
                    {id: '16', 'title': 'A nice day!', src: "http://lorempixel.com/200/204/animals"},
                    {id: '17', 'title': 'Puh!', src: "http://lorempixel.com/200/210/animals"},
                    {id: '18', 'title': 'What a club!', src: "http://lorempixel.com/200/212/animals"}
                ];
            };

            init();

        }]);
}(angular.module("KRAngular.home", [
    'ui.router',
    'akoenig.deckgrid',
    'productService',
    'genericDirectives'
])));