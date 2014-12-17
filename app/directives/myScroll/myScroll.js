'use strict';
angular.module('myApp.myDirectives.myScroll', [])
    .directive('myScroll', function($log, $timeout) {
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
                            setIsPull(true);
                            showPullTop();
                            scrollerTop.attr('class', scope.pullDownTipClassName);
                        }
                    };
                    var pullDownReleaseTips = function(){
                        $log.log('pullDownReleaseTips');
                        if(scope.pullDownReleaseTipClassName){
                            setIsPull(true);
                            showPullTop();
                            scrollerTop.attr('class', scope.pullDownReleaseTipClassName);
                        }
                    };
                    var pullUpTips = function(){
                        if(scope.pullUpTipClassName){
                            scrollerBottom.attr('class', scope.pullUpTipClassName);
                        }
                    };
                    var pullUpReleaseTips = function(){
                        if(scope.pullUpReleaseTipClassName){
                            scrollerBottom.attr('class', scope.pullUpReleaseTipClassName);
                        }
                    };
                    var refreshId;
                    var isPull = false;
                    var setIsPull = function(b){
                        isPull = !!b;
                    };
                    var getIsPull = function(){
                        return isPull;
                    };
                    var refreshScroll = function(){
                        if(!getIsPull()){
                            return;
                        }
                        if(refreshId){
                            $timeout.cancel(refreshId);
                        }
                        //refreshId = $timeout(function(){
                        //    setIsPull(false);
                        //    resetPull();
                        //    scroll.refresh();
                        //}, 0, false);
                    };
                    var resetPull = function(){
                        //scrollerTop[0].style.display = 'none';
                        //scrollerBottom[0].style.display = 'none';
                    };
                    var showPullTop = function(){
                        scrollerTop[0].style.display = 'block';
                    };
                    var showPullBottom = function(){
                        scrollerBottom[0].style.display = 'block';
                    };
                    resetPull();
                    scroll = new IScroll(wrapper[0], {
                        snap : true,
                        probeType : 1,
                        click : true
                    });
                    scroll.maxScrollY = -500;
                    scroll.on('refresh', function(){
                        $log.log('refresh');
                    });
                    scroll.on('scroll', function(){
                        $log.log('scroll', this, this.maxScrollY, pullDownOffset, pullUpOffset);
                        resetPull();
                        if(this.y > 0 && this.y < pullDownOffset){
                            pullDownTips();
                            return;
                        }
                        if(this.y >= pullDownOffset){
                            pullDownReleaseTips();
                            return;
                        }
                        if(this.y > (this.maxScrollY - pullUpOffset) && this.y < this.maxScrollY){
                            pullUpTips();
                            return;
                        }
                        if(this.y < (this.maxScrollY - pullUpOffset )){
                            pullUpReleaseTips();
                            return;
                        }
                    });
                    scroll.on('scrollEnd', function(){
                        $log.log('scrollEnd', this.y);
                        refreshScroll();
                    });
                };
                angular.element(document).ready(function(){
                    initScroll();
                });
            }
        }
    });
