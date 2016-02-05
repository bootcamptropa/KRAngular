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
                        load_data: (['globalService','$stateParams', '$q', '$log',
                            function (globalService, $stateParams, $q, $log) {
                                $log.info('App::ResolveData::');

                                globalService.getGeolocalization().then(function(position){
                                    globalService.setStorageItem('latitude',position.coords.latitude);
                                    globalService.setStorageItem('longitude',position.coords.longitude);
                                },function(err){
                                    console.log(err);
                                    globalService.setStorageItem('latitude',null);
                                    globalService.setStorageItem('longitude',null);
                                });
                            }])
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

    app.run(['$log','$state','$rootScope','configService', 'globalService', function ($log,$state,$rootScope,configService,globalService) {

        configService.setUpInitVars();
        configService.setUpMessages();

        var isLogged = globalService.getStorageItem('lcookier');
        if(($state.current.name==='root.home' || $state.current.name==='') && typeof isLogged !== 'object' && isLogged){
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
                $rootScope.domReady=false;
                $log.warn('Error changing state:');
                $log.warn(fromState);
                $log.warn(toState);
                $rootScope.domReady=true;
            });

        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                //$log.warn('Fired success');
                var isLogged = globalService.getStorageItem('lcookier');

                if(toState.name==="root.home" && typeof isLogged !== 'object' && isLogged){
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

                racesService.getRaces().then(function(data){
                    $scope.data = {};
                    $scope.data.product = {};
                    $scope.data.loaddata = {
                        states : [{id:1,name:'Publicado'},{id:2,name:'Vendido'},{id:3,name:'Cancelado'},{id:4,name:'Suspendido'}],
                        races : data,
                        gender : [{id:1,cod:'MAL',name:'Macho'},{id:2,cod:'FEM',name:'Hembra'},{id:3,cod:'NON',name:'Sin especificar'}],
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

    app.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files);
                    });
                });
            }
        };
    }]);

    app.controller('ModalAddProductCtrl', function ($scope, $uibModalInstance, data,productsService,globalService, $state) {
        $scope.data = data;
        $scope.actionMsg = '';
        $scope.myFile=null;
        var geoData = {};

        var init = function(){
            $scope.btnCancel = true;
            $scope.btnClose = false;
            $scope.btnSave = true;
            globalService.getGeolocalization().then(function(data){
                geoData.latitude=data.coords.latitude;
                geoData.longitude=data.coords.longitude;
            },function(err){
                console.log(data);
            });
        };


        $scope.ok = function () {
            $scope.actionMsg = 'Creando producto...';
            var file = $scope.myFile;
            if ($scope.productForm.$valid){
                productsService.newProduct(data.product,file,geoData).then(function(data){
                    $scope.actionMsg = 'Product Updated!';
                    $scope.btnCancel = false;
                    $scope.btnClose = true;
                    $scope.btnSave = false;
                },function(err){
                    $scope.actionMsg = 'Error al Crear Producto:: '+JSON.stringify(err.data);
                });
                //$uibModalInstance.close($scope.product);
            }else {
                $scope.actionMsg = 'Rellene todos los campos requeridos.';
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('close');
            $state.go($state.current, {}, {reload: true});
        };

        init();
    });

    app.controller('FrontController', ['$scope', '$log','$location','racesService','$rootScope', function ($scope, $log,$location,racesService,$rootScope) {
        $log.info('App:: Starting FrontController');
        $rootScope.search = {};
        $rootScope.search.race = {};
        $rootScope.search.distance = {};

        $scope.updateSearchParam = function(param,value,value2){

            if(param==='race'){
                $rootScope.search.race = {};
                $rootScope.search.race.id=value;
                $rootScope.search.race.name=value2;
            }
            if(param==='distance'){
                $rootScope.search.distance = {};
                $rootScope.search.distance.id=value;
                $rootScope.search.distance.name=value2;
            }
            $log.info('Paramtros de Busqueda:');
            $log.info($rootScope.search);
        };

        $scope.submitSearch = function(){
            $rootScope.$broadcast('newSearch', {
                search: $rootScope.search
            });
        };

        $scope.cleanSearch = function(){

            $log.info('Limpiamos filtros.');

            $rootScope.search.race = {};
            $rootScope.search.race.id=null;
            $rootScope.search.race.name=null;

            $rootScope.search.distance = {};
            $rootScope.search.distance.id=null;
            $rootScope.search.distance.name=null;

            $scope.submitSearch();
        };

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
