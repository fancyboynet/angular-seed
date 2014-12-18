'use strict';
angular.module('angular-fScroll', [])
    .directive('fScroll', function() {
        return{
            restrict: 'E',
            scope: {
                onScroll : '&fScrollOnScroll',
                onTopPullDown : '&fScrollOnTopPullDown',
                onTopPullDownRelease : '&fScrollOnTopPullDownRelease',
                onBottomPullUp : '&fScrollOnBottomPullUp',
                onBottomPullUpRelease : '&fScrollOnBottomPullUpRelease'
            },
            replace: true,
            transclude: true,
            template : '<div><div ng-transclude></div></div>',
            link : function(scope, element, attrs){
                var wrapper = angular.element(element);
                var scroller = wrapper.children();
                var scroll = fScroll({
                    wrapper : wrapper[0],
                    scroller : scroller[0]
                });
                scroll.setOptions({
                    onScroll : function(){
                        scope.onScroll && scope.onScroll({scroll : scroll});
                    },
                    onTopPullDown : function(offset){
                        scope.onTopPullDown && scope.onTopPullDown({scroll : scroll, offset : offset});
                    },
                    onTopPullDownRelease : function(offset){
                        scope.onTopPullDownRelease && scope.onTopPullDownRelease({scroll : scroll, offset : offset});
                    },
                    onBottomPullUp : function(offset){
                        scope.onBottomPullUp && scope.onBottomPullUp({scroll : scroll, offset : offset});
                    },
                    onBottomPullUpRelease : function(offset){
                        scope.onBottomPullUpRelease && scope.onBottomPullUpRelease({scroll : scroll, offset : offset});
                    }
                });
            }
        }
    });
