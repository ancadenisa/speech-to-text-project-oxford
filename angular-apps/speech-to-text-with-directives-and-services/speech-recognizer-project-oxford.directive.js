var myapp = angular.module('speechToText');
myapp.directive('speechRecognizerProjectOxford', function($http, $timeout, RecordRecognizeSpeechService) {
	var directive = {};
	directive.restrict = 'E';
	directive.template = "<button ng-click = 'startRecordingAndRecognizinProcess()'>{{label}}</button><br/><ng-transclude> </ng-transclude>" + 
						"Your message is <div ng-if='textMessage'>{{textMessage}}</div>";
	directive.scope = {
		label: '@label'
	};
	
	directive.transclude = true;

	directive.link = function(scope, elem, attrs) {
		scope.rootElem = elem;
		function checkIfValidMessage(commands, message){
			for (var i = 0; i < commands.length; i++) {
				if(commands[i].getAttribute('text') == message){
					eval('angular.element(commands[i]).scope().$$childHead.' + commands[i].getAttribute('on-recognize'));
					break;
				}
			}
			if(i == commands.length){
				console.log("Command not recognized");
			}
		}

		scope.startRecordingAndRecognizinProcess = function() {
			RecordRecognizeSpeechService.record().then(function(response){
				scope.textMessage =  response;
				var rootElemChildren = scope.rootElem.children();
				if (rootElemChildren == null || rootElemChildren[2] == null || rootElemChildren[2].children == null) {
					console.log("No children commands detected");
					return;
				}
				
				var transcludeNodeChildren = rootElemChildren[2].children;
				
				checkIfValidMessage(transcludeNodeChildren, scope.textMessage); 						
			});
		}
	}
	return directive;
});