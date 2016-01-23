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
                    return false;
                };

                scope.haveImage = function() {
                    if (scope.model.images.length > 0){
                        return true;
                    }

                    return false;
                };
            }
        };
    });