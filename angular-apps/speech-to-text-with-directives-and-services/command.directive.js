var myapp = angular.module('speechToText');
myapp.directive('command', function($http, $timeout) {
	var directive = {};
	directive.restrict = 'E';

	directive.scope = {
		text: '@text',
		recognizeAction: '@onRecognize'
		
	};
	directive.link  =  function (scope, element, attrs) { 
		console.log("hei");
		scope.invoke = function(path) {
			console.log("This i what i should invoke" +  '("http://" + "<boardUrl>" + "/"' + path + ')');
		};
	}
	return directive;
});