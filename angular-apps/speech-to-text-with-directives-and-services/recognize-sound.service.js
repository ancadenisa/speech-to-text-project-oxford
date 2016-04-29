var myapp = angular.module('speechToText');
myapp.factory('RecognizeSpeechService', function($http, $timeout, $q) {
		var factory = {};
		var deferred;
		var message ="";
		var clientId = 'test-app'; // Can be anything
		var clientSecret = '919963ddb0f143009e81cc1c00046483'; // API key from Azure marketplace
		var audioBufferReceived;
		// ==== Helpers ====
		function getAccessToken(clientId, clientSecret, callback) {
			var req = {
				method: 'POST',
				url: 'https://oxford-speech.cloudapp.net/token/issueToken',
				data: {
					'grant_type': 'client_credentials',
					'client_id': encodeURIComponent(clientId),
					'client_secret': encodeURIComponent(clientSecret),
					'scope': 'https://speech.platform.bing.com'
				}
			};
			$http(req).then(function(response) {
				if (response.status != 200) return callback(response);
				var accessToken = response.data.access_token;
				if (accessToken) {
					callback(null, accessToken);
				} else {
					callback(response);
				}
			});
		}

		function speechToText(accessToken, callback) {
			var req = {
				method: 'POST',
				url: 'https://speech.platform.bing.com/recognize/query',
				params: {
					'scenarios': 'ulm',
					'appid': 'D4D52672-91D7-4C74-8AD8-42B1D98141A5', // This magic value is required
					'locale': 'en-US',
					'device.os': 'wp7',
					'version': '3.0',
					'format': 'json',
					'requestid': '1d4b6030-9099-11e0-91e4-0800200c9a66', // can be anything
					'instanceid': '1d4b6030-9099-11e0-91e4-0800200c9a66' // can be anything
				},
				data: audioBufferReceived,
				headers: {
					'Authorization': 'Bearer ' + accessToken,
					'Content-Type': 'audio/wav; samplerate=16000',
					'Content-Length': audioBufferReceived.length
				},
				transformRequest: angular.identity
			};
			$http(req).then(function(resp) {
				if (resp.status != 200) {
					return callback(resp);
				}
				callback(null, resp.data);
			});
		}
		

		factory.recognize = function(audioBuffer) {
			audioBufferReceived = audioBuffer;
			deferred = $q.defer();
			getAccessToken(clientId, clientSecret, function(response, accessToken) {
				if (response) {
					console.log("Something is not ok in our response");
				}
				console.log('Got access token: ' + accessToken)
				speechToText(accessToken, function(err, res) {
					if (err) {
						console.log("We have an error");
						return console.log(err);
					}
					

					if (res == null || res == undefined || res.results == null ) {
						console.log("Something is not ok in our response");
						deferred.resolve( message );
					}else{
						message =  res.results[0].lexical;
						deferred.resolve( message );
					}												
				});
			})
			return deferred.promise;
		}
		return factory;
});