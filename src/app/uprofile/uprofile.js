(function (app) {
    app.config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('root.uprofile', {
                    url: '/uprofile',
                    parent: 'root',
                    views: {
                        "container@": {
                            controller: 'uprofileController',
                            templateUrl: 'uprofile/uprofile.tpl.html'
                        }
                    },
                    resolve:{
                        modelData: (['productsService', '$q', '$log',
                            function (productsService, $q, $log) {
                                $log.warn('UserProfile::ResolveData::');

                                var def = $q.defer();
                                productsService.getProducts().then(function (data) {
                                    def.resolve(data);
                                    $log.warn(data);
                                }, function (err) {
                                    def.reject(err);
                                });
                                return def.promise;
                            }])
                    },
                    data: {
                        pageTitle: 'uprofile'
                    }
                });
        }]);

    app.controller('uprofileController', ['$scope', '$log','$state','modelData', function ($scope, $log,$state,modelData) {
        $log.info('App:: Starting uprofileController');

        var init = function () {
            $scope.model = modelData;
            $scope.model.pageTitle = $state.current.data.pageTitle;
        };
        init();
    }]);

}(angular.module("KRAngular.uprofile", [
    'ui.router',
    'productsService'
])));