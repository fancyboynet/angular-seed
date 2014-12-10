'use strict';
angular.module('myApp.myDirectives.myScroll', [])
    .directive('myScroll', function($log, $window) {
        return{
            restrict: 'E',
            scope: {
                pullDownTipClassName : '@myScrollPullDownTipClass',
                pullDownReleaseTipClassName : '@myScrollPullDownReleaseTipClass',
                pullUpTipClassName : '@myScrollPullUpTipClass',
                pullUpReleaseTipClassName : '@myScrollPullUpReleaseTipClass',
                onRefresh : '&myScrollOnRefresh'
            },
            replace: true,
            transclude: true,
            template : '<div><div><div></div><div ng-transclude></div><div></div></div></div>',
            link : function(scope, element, attrs){
                var wrapper = angular.element(element);
                var scroller = wrapper.children();
                var scrollerTop = scroller.children().eq(0);
                var scrollerBottom = scroller.children().eq(2);
                $log.log(scope, element, attrs, scrollerTop[0].offsetHeight);
                wrapper.css({
                    position : 'absolute',
                    top : '0',
                    left : '0',
                    bottom : '0',
                    width : '100%',
                    overflow: 'hidden'
                });
                scroller.css({
                    position : 'absolute',
                    width : '100%',
                    overflow: 'hidden'
                });
                if(scope.pullDownTipClassName){
                    scrollerTop.addClass(scope.pullDownTipClassName);
                }
                if(scope.pullUpTipClassName){
                    scrollerBottom.addClass(scope.pullUpTipClassName);
                }
                var scroll;
                var initScroll = function(){
                    var scrollerTopHeight = scrollerTop[0].offsetHeight;
                    var scrollerBottomHeight = scrollerBottom[0].offsetHeight;
                    var pullDownOffset = scrollerTopHeight / 2 || 20;
                    var pullUpOffset = scrollerBottomHeight / 2 || 20;
                    var pullDownTips = function(){
                        $log.log('pullDownTips');
                        if(scope.pullDownTipClassName){
                            scrollerTop.attr('class', scope.pullDownTipClassName);
                        }
                    };
                    var pullDownReleaseTips = function(){
                        $log.log('pullDownReleaseTips');
                        if(scope.pullDownReleaseTipClassName){
                            scrollerTop.attr('class', scope.pullDownReleaseTipClassName);
                        }
                    };
                    var pullUpTips = function(){
                        if(scope.pullUpTipClassName){
                            scrollerTop.attr('class', scope.pullUpTipClassName);
                        }
                    };
                    var pullUpReleaseTips = function(){
                        if(scope.pullUpReleaseTipClassName){
                            scrollerTop.attr('class', scope.pullUpReleaseTipClassName);
                        }
                    };
                    scroller.css({
                        marginTop : -scrollerTopHeight + "px"
                    });
                    scroll = new IScroll(wrapper[0], {
                        snap : true,
                        probeType : 1,
                        click : true
                    });
                    scroll.on('refresh', function(){
                        $log.log('refresh');
                    });
                    scroll.on('scroll', function(){
                        $log.log('scroll', this.y, this.maxScrollY, pullDownOffset, pullUpOffset);
                        if(this.y > 0 && this.y < pullDownOffset){
                            pullDownTips();
                            return;
                        }
                        if(this.y >= pullDownOffset){
                            pullDownReleaseTips();
                            return;
                        }
                        if(this.y > (this.maxScrollY - pullUpOffset + scrollerBottomHeight) && this.y < (this.maxScrollY + scrollerBottomHeight)){
                            pullUpTips();
                            return;
                        }
                        if(this.y < (this.maxScrollY - pullUpOffset + scrollerBottomHeight)){
                            pullUpReleaseTips();
                            return;
                        }
                    });
                    scroll.on('scrollEnd', function(){
                        $log.log('scrollEnd', this.y);
                    });
                };
                angular.element(document).ready(function(){
                    initScroll();
                });
            }
        }
    });
