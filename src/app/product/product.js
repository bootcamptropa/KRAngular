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
                    resolve:{
                        productData: (['productService', '$q', '$log','$state','$stateParams',
                            function (productService, $q, $log,$state,$stateParams) {
                                console.log($stateParams);
                                $log.info('Product::ResolveData::');
                                var def = $q.defer();
                                productService.api('/products/'+$stateParams.productId+'/').getObject({}, {}, function (data) {
                                    def.resolve(data);
                                }, function (err) {
                                    def.reject(err);
                                });
                                return def.promise;

                            }])
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

    app.controller('ProductController', ['$scope', '$log', '$state','NgMap','productService','productData','$rootScope','globalService', function ($scope, $log, $state,NgMap,productService,productData,$rootScope,globalService) {
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

            var slides = $scope.slides = [];
            $scope.addSlide = function(url,imgName) {
                slides.push({
                    image: url,
                    text: imgName
                });
            };
            $scope.addSlide('../assets/images/placeholder.png','');

            NgMap.getMap().then(function(map) {
                /*                console.log(map.getCenter());
                 console.log('markers', map.markers);
                 console.log('shapes', map.shapes);*/
            });

            $scope.product = productData;
            var imagesArr = $scope.product.images;
            for(var i=0;i<imagesArr.length;i++) {
                if (i === 0) {
                    $scope.slides[i].image = imagesArr[i].photo_url;
                    $scope.slides[i].text = $scope.name;
                } else {
                    $scope.addSlide(imagesArr[i].photo_url, $scope.name);
                }
            }

            $scope.isCollapsed = true;
            $scope.buyText = "Comprar";
            var buyed = true;

            $scope.changeCollaps = function () {
                if ($rootScope.uData.userId != productData.seller.id) {
                    var isLogged = globalService.getStorageItem('lcookier');
                    if(typeof isLogged !== 'object' && isLogged) {
                        $scope.isCollapsed = !$scope.isCollapsed;
                    }else{
                        alert('Debe estar registrado para comprar un producto.');
                        $state.go('root.auth');
                    }

                } else {
                    $scope.buyText = 'No puedes comprar tus propios productos :D';
                }
            };

            $scope.buyProduct = function(){
                //prodId product.id
                $log.info('Info $rootScope: ',$rootScope);
                if(typeof $rootScope.uData.wcookie === "string") {
                    $scope.actionMsg = 'Updating selected product...';
                    productService.saveTransaction(prodId).then(function(data){
                        $scope.buyText = 'Comprado!!!';
                        $scope.isCollapsed = true;
                        buyed = false;
                    },function(err){
                        $scope.buyText = 'Error buying: '+err;
                        $scope.isCollapsed = true;
                        buyed = false;
                    });
                } else {
                    $log.warn('NotLoged');
                    alert('You must be logged in order to buy');
                    $state.go('root.auth');
                }
            };
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
            if (gender == "NON") { return "No especificado"; }
            else if (gender == "MAL") { return "Macho"; }
            else if (gender == "FEM") { return "Hembra"; }
            else { return ""; }
        };
    });
    app.filter("boolVal", function() {
        return function(boolVal) {
            if(boolVal) {
                return "Si";
            } else if(!boolVal)  {
                return "No";
            } else {
                return "";
            }
        };
    });

}(angular.module("KRAngular.product", [
    'ui.bootstrap',
    'ui.router',
    'globalService',
    'productService',
    'ngMap'
])));