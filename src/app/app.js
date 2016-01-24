(function (app) {

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider','$resourceProvider','localStorageServiceProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider,$resourceProvider,localStorageServiceProvider) {
            $resourceProvider.defaults.stripTrailingSlashes = false;
            $urlRouterProvider.otherwise('/');
            $httpProvider.interceptors.push('cInterceptor');

            //Config cookie system 1.0 2.0
            localStorageServiceProvider
                .setPrefix('')
                .setStorageType('localStorage')
                .setStorageCookie(1, '/')
                //.setStorageCookieDomain('walladog.com')
                //For testing pruposals use empty string instade of walladog domain
                .setStorageCookieDomain('')
                .setNotify(true, true);

            //Root view, very important resolve data async before states
            $stateProvider
                .state('root', {
                    url: '',
                    abstract: true,
                    resolve:{
                    },
                    views: {
                        'global': {
                            templateUrl: 'global.tpl.html',
                            controller: 'GlobalController'
                        },
                        'header': {
                            templateUrl: 'header.tpl.html',
                            controller: 'FrontController'
                        },
                        'footer': {
                            templateUrl: 'footer.tpl.html',
                            controller: 'FooterController'
                        }
                    }
                });

            //Remove hashtag from URL
            $locationProvider.html5Mode(true);
        }
    ]);

    app.run(['$log','$state','$rootScope','configService', function ($log,$state,$rootScope,configService) {

        configService.setUpInitVars();
        configService.setUpMessages();

        if($state.current.name==='root.home' || $state.current.name===''){
            $rootScope.showCameraIcon = true;
        }

        /** watchers para cambio de vista **/
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                $rootScope.domReady=false;
                //$log.warn('Fired stateChangeStart');
            });

        $rootScope.$on('$stateChangeError',
            function(event, toState, toParams, fromState, fromParams, error){
                $log.warn('Error changing state:');
                $log.warn(fromState);
                $log.warn(toState);
                $rootScope.domReady=true;
            });

        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                //$log.warn('Fired success');
                if(toState.name==="root.home"){
                    $rootScope.showCameraIcon = true;
                }else{
                    $rootScope.showCameraIcon = false;
                }
                $rootScope.domReady=true;
            });


    }]);


    app.controller('AppController', ['$scope', '$log','racesService','$uibModal','globalService',
        function ($scope, $log,racesService,$uibModal,globalService) {
        $log.info('App:: Starting AppController');

        $scope.addProductModal = function(){

            navigator.geolocation.getCurrentPosition(function(position) {
                globalService.setStorageItem('latitude',position.coords.latitude);
                globalService.setStorageItem('longitude',position.coords.longitude);
            });

            racesService.getRaces().then(function(data){
                $scope.data = {};
                $scope.data.product = {};
                $scope.data.loaddata = {
                    states : [{id:1,name:'Publicado'},{id:2,name:'Vendido'},{id:3,name:'Cancelado'},{id:4,name:'Suspendido'}],
                    races : data,
                    gender : [{id:1,name:'MAL'},{id:2,name:'FEM'},{id:3,name:'NON'}],
                    sterile: [{id:1,name:'true'},{id:0,name:'false'}],
                    categories: [{id:1,name:'Perros'},{id:2,name:'Comida'},{id:3,name:'Ropa'},{id:4,name:'Accesorios'},{id:5,name:'Otros'}]
                };

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modalAddProduct.tpl.html',
                    controller: 'ModalAddProductCtrl',
                    size: 'lg',
                    resolve: {
                        data: function(){
                            return $scope.data;
                        }
                    }
                });

                modalInstance.result.then(function (updatedProduct) {
                    $scope.newProduct = updatedProduct;
                    console.log($scope.newProduct);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            },function(err){

            });



        };

    }]);

    app.controller('ModalAddProductCtrl', function ($scope, $uibModalInstance, data,productsService) {
        $scope.data = data;
        $scope.actionMsg = '';

        $scope.ok = function () {
            $scope.actionMsg = 'Updating selected product...';
            productsService.newProduct(data.product).then(function(data){
                $scope.actionMsg = 'Product Updated!';
            },function(err){
                $scope.actionMsg = 'Error updating product:: '+JSON.stringify(err);
            });
            //$uibModalInstance.close($scope.product);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('FrontController', ['$scope', '$log','$location','racesService', function ($scope, $log,$location,racesService) {
        $log.info('App:: Starting FrontController');


        $scope.isCollapsed = true;

        racesService.getRaces().then(function(data) {
            $scope.races = data;
        });

    }]);

    app.controller('FooterController', ['$scope', '$log', function ($scope, $log) {
        $log.info('App:: Starting FooterController');
    }]);

    app.controller('GlobalController', ['$scope', '$log', function ($scope, $log) {
        $log.info('App:: Starting GlobalController');
    }]);

}(angular.module("KRAngular", [
    'ngResource',
    'globalService',
    'racesService',
    'LocalStorageModule',
    'cInterceptor',
    'configService',
    'genericDirectives',
    'KRAngular.home',
    'KRAngular.customer',
    'KRAngular.product',
    'KRAngular.about',
    'KRAngular.apitest',
    'KRAngular.infinite',
    'KRAngular.auth',
    'KRAngular.uprofile',
    'ui.bootstrap',
    'templates-app',
    'templates-common',
    'templates-hf',
    'ui.router.state',
    'ui.router',
    'ngAnimate',
    'angularjs-dropdown-multiselect'
])));
