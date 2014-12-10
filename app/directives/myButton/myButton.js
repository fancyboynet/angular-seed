'use strict';
angular.module('myApp.myDirectives.myButton', [])

    .directive('myButton', function() {
          return{
            restrict: 'E',
            scope: false,
            replace: true,
            template : '<div>123213</div>',
            link : function(scope, element, attrs){
                console.log(arguments);
            }
          }
    })
