/**
 * Created by hadock on 8/09/15.
 */
angular.module('genericDirectives', [])

    .directive('menu',function(){
        return {
            templateUrl: 'directives/templates/menu.tpl.html',
            restrict: 'E',
            replace: true
        };

    })

    .directive('productList',function(){
        return {
            restrict: "AE",
            templateUrl: "directives/templates/productlist.tpl.html",
            replace: true,
            scope: {
                model: "=",
                onEdit: '&'
            },
            link: function (scope) {
                scope.gotoAlbum = function (id_album) {
                    $state.go('root.product', {'id_product': parseInt(id_product)});
                };
            }
        };

    })

    .directive('productListUprofile',function(){
        return {
            restrict: "AE",
            templateUrl: "directives/templates/productlistUprofile.tpl.html",
            replace: true,
            scope: {
                model: "=",
                onEdit: '&'
            },
            link: function (scope) {
                scope.gotoAlbum = function (id_album) {
                    $state.go('root.product', {'id_product': parseInt(id_product)});
                };
            }
        };

    })
    .directive('transactionList',function(){
        return {
            restrict: "AE",
            templateUrl: "directives/templates/transactionList.tpl.html",
            replace: true,
            scope: {
                model: "=",
                onEdit: '&'
            },
            link: function (scope) {
                scope.gotoAlbum = function (id_album) {
                    $state.go('root.product', {'id_product': parseInt(id_product)});
                };
            }
        };

    })
    .directive('tusDatos',function(){
        return {
            restrict: "AE",
            templateUrl: "directives/templates/tusDatos.tpl.html",
            replace: true,
            scope: {
                model: "=",
                onEdit: '&'
            },
            link: function (scope) {
                scope.gotoAlbum = function (id_album) {
                    $state.go('root.product', {'id_product': parseInt(id_product)});
                };
            }
        };

    });