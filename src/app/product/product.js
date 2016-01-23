(function (app) {
    app.config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('root.product', {
                    url: '/product/:productId',
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
                    url: '/productadd',
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

    app.controller('ProductController', ['$scope', '$log', '$state','NgMap','productService', function ($scope, $log, $state,NgMap,productService) {
        $log.info('App:: Starting CustomerController');


        var init = function () {
            $scope.model = {};
            $scope.product = {};
            $scope.model.pageTitle = $state.current.data.pageTitle;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = true;

            var prodId = '';
            if (!$state.params.productId){
                $state.go('root.home');
            }
            else {
                prodId = $state.params.productId;
                $log.debug("idProduct: " + prodId);
            }

            var prom = productService.getProduct(prodId);

            var slides = $scope.slides = [];
            $scope.addSlide = function(url,imgName) {
                slides.push({
                    image: url,
                    text: imgName
                });
            };
            $scope.addSlide('../assets/images/placeholder.png','');

            NgMap.getMap().then(function(map) {
                console.log(map.getCenter());
                console.log('markers', map.markers);
                console.log('shapes', map.shapes);
            });

            prom.then(function(data){
                $scope.product = data;
                $log.info("product data: ", data);
                $log.info("$scope.product.name ",$scope.product);
                var imagesArr = $scope.product.images;
                for(var i=0;i<imagesArr.length;i++) {
                    if (i === 0) {
                        $scope.slides[i].image = imagesArr[i].photo_url;
                        $scope.slides[i].text = $scope.name;
                    } else {
                        $scope.addSlide(imagesArr[i].photo_url, $scope.name);
                    }
                }
            },function(err){
                $log.error(err);
                $log.info("geting dummy data");
                /*$scope.product = {
                 "id": 1,
                 "name": "Venta",
                 "race": "race test",
                 "seller": {
                 avatar_url: "http://lorempixel.com/50/50/people",
                 first_name: "Dummy Name",
                 last_name: "Dummier Lastname",
                 username: "Dummz"
                 },
                 "gender": "NON",
                 "sterile": false,
                 "description": "Y, viéndole don Quijote de aquella manera, con muestras de tanta tristeza, le dijo: Sábete, Sancho, que no es un hombre más que otro si no hace más que otro. Todas estas borrascas que nos suceden son señales de que presto ha de serenar el tiempo y han de sucedernos bien las cosas; porque no es posible que el mal ni el bien sean durables, y de aquí se sigue que, habiendo durado mucho el mal, el bien está ya cerca. Así que, no debes congojarte por las desgracias que a mí me suceden, pues a ti no te cabe parte dellas.Y, viéndole don Quijote de aquella manera, con muestras de tanta tristeza, le dijo: Sábete, Sancho, que no es un hombre más que otro si no hace más que otro. Todas estas borrascas que nos suceden son señales de que presto ha de serenar el tiempo y han de sucedernos bien las cosas; porque no es posible que el mal ni el bien sean durables, y de aquí se sigue que, habiendo durado mucho el mal, el bien está ya cerca. Así que, no debes congojarte por las desgracias que a mí me suceden, pues a ti no",
                 "state": "dummy state",
                 "price": 12.5,
                 "category": "Dummy category",
                 "active": true,
                 "longitude": -63.1802951,
                 "latitude": -17.7835109,
                 "created_at": "2016-01-04T15:02:42Z",
                 "images": [
                 {
                 "id": 23,
                 "name": "897b5966-012a-4797-b8b5-e790c5",
                 "photo_url": "https://s3.amazonaws.com/walladog/897b5966-012a-4797-b8b5-e790c57d4f08.jpeg",
                 "photo_thumbnail_url": "https://s3.amazonaws.com/walladog/897b5966-012a-4797-b8b5-e790c57d4f08thumbnail.jpeg",
                 "created_at": "2016-01-14T16:07:15Z",
                 "updated_at": "2016-01-17T19:00:32Z"
                 },
                 {
                 "id": 24,
                 "name": "b1778e1f-91b3-4553-9552-9e9451",
                 "photo_url": "https://s3.amazonaws.com/walladog/b1778e1f-91b3-4553-9552-9e9451645356.jpeg",
                 "photo_thumbnail_url": "https://s3.amazonaws.com/walladog/b1778e1f-91b3-4553-9552-9e9451645356thumbnail.jpeg",
                 "created_at": "2016-01-14T16:08:40Z",
                 "updated_at": "2016-01-17T19:00:21Z"
                 },
                 {
                 "id": 25,
                 "name": "4ad34df8-7d1a-4503-b499-e1bd3e",
                 "photo_url": "https://s3.amazonaws.com/walladog/4ad34df8-7d1a-4503-b499-e1bd3ecf4039.jpeg",
                 "photo_thumbnail_url": "https://s3.amazonaws.com/walladog/4ad34df8-7d1a-4503-b499-e1bd3ecf4039thumbnail.jpeg",
                 "created_at": "2016-01-14T16:08:47Z",
                 "updated_at": "2016-01-17T19:00:12Z"
                 }
                 ]
                 };

                 /*var imagesArr = $scope.product.images;
                 for(var i=0;i<imagesArr.length;i++) {
                 if(i===0){
                 $scope.slides[i].image = imagesArr[i].photo_url;
                 $scope.slides[i].text  = $scope.name;
                 } else {
                 $scope.addSlide(imagesArr[i].photo_url,$scope.name);
                 }
                 }*/
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
                console.log(map.getCenter());
                console.log('markers', map.markers);
                console.log('shapes', map.shapes);
            });
        };

        init();

    }]);
    app.filter("genders", function() {
        return function(gender) {
            if (gender == "NON") { return "Not specified"; }
            else if (gender == "MAL") { return "Male"; }
            else if (gender == "FEM") { return "Female"; }
            else { return ""; }
        };
    });
    app.filter("boolVal", function() {
        return function(boolVal) {
            if(boolVal) {
                return "Yes";
            } else  {
                return "No";
            }
        };
    });

}(angular.module("KRAngular.product", [
    'ui.router',
    'globalService',
    'productService',
    'ngMap'
])));