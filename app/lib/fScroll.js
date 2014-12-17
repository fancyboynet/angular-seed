(function(g){
    if(g.fScroll){
        return;
    }
    var fScroll = function(opt){
        return new Scroll(opt);
    };
    var hasBindedDoc;
    var helpers = {
        extend : function(to, from){
            for (var key in from) {
                if (!from.hasOwnProperty(key)) {
                    continue;
                }
                to[key] = from[key];
            }
            return to;
        },
        getTouchById : function(touches, id){
            var touch;
            if(!touches){
                return touch;
            }
            for(var i = 0, len = touches.length; i < len; i++){
                if(touches[i].identifier === id){
                    touch = touches[i];
                    break;
                }
            }
            return touch;
        }
    };
    var Scroll = function(opt){
        return this._init(opt);
    };
    var defaultOpt = {
        wrapper : null,
        scroller : null,
        transition : 'cubic-bezier(0.1, 0.57, 0.1, 1)',
        onScroll : function(){},
        onTopPullDown : function(){},
        onBottomPullUp : function(){},
        onTopPullDownRelease : function(){},
        onBottomPullUpRelease : function(){}
    };
    var attr = {
        wrapper : null,
        scroller : null,
        touchId : -1,
        viewHeight : 0,
        scrollHeight : 0,
        startY : 0,
        startScreenY : 0,
        y : 0,
        minY : 0,
        maxY : 0,
        topOffset : 0,
        bottomOffset : 0
    };
    helpers.extend(Scroll.prototype, {
        _init : function(opt){
            var self = this;
            helpers.extend(self, attr);
            self.opt = helpers.extend(defaultOpt, opt);
            self._initDom()
                ._updateSizeInfo()
                ._addListener()
                ._setY(self.maxY);
            return self;
        },
        _initDom : function(){
            var self = this;
            self.wrapper = self.opt.wrapper;
            self.scroller = self.opt.scroller;
            self.wrapper.style.cssText = 'position:relative;overflow:hidden;width:100%;height:100%';
            self.scroller.style.cssText = 'position:absolute;top:0;left:0;width:100%';
            self.scroller.style.transition = self.opt.transition;
            return self;
        },
        _updateSizeInfo : function(){
            var self = this;
            self._updateViewHeight();
            self._updateScrollHeight();
            self._updateMaxY();
            self._updateMinY();
            return self;
        },
        _updateViewHeight : function(){
            var self = this;
            self.viewHeight = self.wrapper.clientHeight;
        },
        _updateScrollHeight : function(){
            var self = this;
            self.scrollHeight = self.scroller.scrollHeight;
        },
        _updateMaxY : function(){
            var self = this;
            self.maxY = -self.topOffset;
        },
        _updateMinY : function(){
            var self = this;
            self.minY = Math.min(self.maxY, self.viewHeight - self.scrollHeight + self.bottomOffset);
        },
        _addListener : function(){
            var self = this;
            if(!hasBindedDoc){
                //解决dom改变时scroller不会触发touchstart bug.
                document.addEventListener('touchstart', function(){}, false);
            }
            hasBindedDoc = true;
            self.scroller.addEventListener('touchstart', function(e){
                self._startMove(e.touches);
            }, false);
            self.scroller.addEventListener('touchmove', function(e){
                self._move(e.touches);
            }, false);
            self.scroller.addEventListener('touchend', function(e){
                self._endMove(e.changedTouches);
            }, false);
            return self;
        },
        _startMove : function(touches){
            var self = this;
            if(!touches){
                return self;
            }
            self._updateSizeInfo();
            var touch = touches[0];
            self.touchId = touch.identifier;
            self.startY = self.y;
            self.startScreenY = touch.screenY;
            return self;
        },
        _endMove : function(touches){
            var self = this;
            var touch = helpers.getTouchById(touches, self.touchId);
            if(!touch){
                return self;
            }
            self._distinguishUpAction();
            self._setTransitionTime();
            self._updateY();
            return self;
        },
        _move : function(touches){
            var self = this;
            var touch = helpers.getTouchById(touches, self.touchId);
            if(!touch){
                return self;
            }
            self._moveY(self.startY + touch.screenY - self.startScreenY);
            return self;
        },
        _moveY : function(y){
            var self = this;
            self._setTransitionTime(0);
            self._setY(y);
            self.opt.onScroll.call(self);
            self._distinguishMoveAction();
            return self;
        },
        _setTransitionTime : function(time){
            var self = this;
            self.scroller.style['transitionDuration'] = (time === undefined ? 200 : time) + 'ms';
        },
        _isOverTop : function(){
            var self = this;
            return self.y > self.maxY;
        },
        _getOffsetToTop : function(){
            var self = this;
            return Math.abs(self.maxY - self.y);
        },
        _getOffsetToBottom : function(){
            var self = this;
            return Math.abs(self.minY - self.y);
        },
        _isOverBottom: function(){
            var self = this;
            return self.y < self.minY;
        },
        _distinguishUpAction : function(){
            var self = this;
            if(self._isOverTop()){
                self.opt.onTopPullDownRelease.call(self, self._getOffsetToTop());
            }
            if(self._isOverBottom()){
                self.opt.onBottomPullUpRelease.call(self, self._getOffsetToBottom());
            }
        },
        _distinguishMoveAction : function(){
            var self = this;
            if(self._isOverTop()){
                self.opt.onTopPullDown.call(self, self._getOffsetToTop());
            }
            if(self._isOverBottom()){
                self.opt.onBottomPullUp.call(self, self._getOffsetToBottom());
            }
        },
        _setY : function(y){
            var self = this;
            self.scroller.style.transform = 'translate(0, ' + y + 'px)';
            self.y = y;
            return self;
        },
        _updateY : function(){
            var self = this;
            var targetY = self.y;
            if(targetY > self.maxY){
                targetY = self.maxY;
            }
            else if(targetY < self.minY){
                targetY = self.minY
            }
            if(targetY !== self.y){
                self._setY(targetY);
            }
            return self;
        },
        setTopOffset : function(y){
            var self = this;
            self.topOffset = y;
            self._updateSizeInfo();
            self._setTransitionTime();
            self._updateY();
            return self;
        },
        setBottomOffset : function(y){
            var self = this;
            self.bottomOffset = y;
            self._updateSizeInfo();
            self._setTransitionTime();
            self._updateY();
            return self;
        },
        scrollTo : function(y){
            return this._setY(y);
        },
        setOptions : function(opt){
            var self = this;
            self.opt = helpers.extend(self.opt, opt);
            return self;
        }
    });

    if (typeof define === "function") { //AMD|CMD
        define(function(require, exports, module) {
            module.exports = fScroll;
        });
        return;
    }
    if(typeof require === 'function' && typeof exports === 'object' && typeof module === 'object'){ //CommonJS|NodeJS
        module.exports = fScroll;
        return;
    }
    g.fScroll = fScroll; //normal
})(this);