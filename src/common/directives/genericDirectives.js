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

                scope.haveAvatar = function() {
                    if (scope.model.seller.avatar_url){
                        return true;
                    }
                    return false;
                };

                scope.haveImage = function() {
                    if (scope.model.images.length > 0){
                        return true;
                    }

                    return false;
                };

                scope.getItems = function() {
                    if (scope.model.seller.products_count == 1){
                        return false;
                    }

                    return true;
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

    });