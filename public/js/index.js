angular.module('speech', []);

angular.module('speech').controller('speechController', function($scope,$http) {
  this.rec = new webkitSpeechRecognition();
  this.interim = '';
  this.final = '';
  this.data = '';
  this.talk = 'pi';
 var self = this;
  
  this.rec.continuous = false;
  this.rec.lang = 'en-US';
  this.rec.interimResults = true;
  this.rec.onerror = function(event) {
    console.log('error!');
  };

  this.startForMobile = function() {
    self.talk = 'mobile';
    self.rec.start();
  };
  
 this.startForPi = function() {
    self.talk = 'pi';
    self.rec.start();
  };

  this.rec.onresult = function(event) {
    for(var i = event.resultIndex; i < event.results.length; i++) {
      if(event.results[i].isFinal) {
        //self.final = self.final.concat(event.results[i][0].transcript);
        // clearing interim
        //self.interim = '';
        $scope.$apply();
        self.data = event.results[i][0].transcript;
        console.log(self.data);
	console.log("talk: "+ self.talk);
       
	if(self.talk == "mobile"){
		$http.post("/speech-to-text/", self.data).then(function(response) {
	  	window.speechSynthesis.speak(new SpeechSynthesisUtterance(response.data));
          	console.log('Data posted successfully: '+ response.data);
        }).catch(function(response){
	  	console.log('exception');
	})
	} else if (self.talk == "pi"){
		$http.post("/speech-to-text-to-pi/", self.data).then(function(response) {
         	// window.speechSynthesis.speak(new SpeechSynthesisUtterance(response.data));
          	console.log('Data posted successfully piii: '+ response.data);
        }).catch(function(response){
        	console.log('exception');
        })
	}
      } else {
	//window.speechSynthesis.speak(new SpeechSynthesisUtterance('Data posted successfully'));
          //console.log('!!Data posted successfully');
        self.interim = '';
        $scope.$apply();
        self.interim = self.interim.concat(event.results[i][0].transcript);
        $scope.$apply();
      }
    }
  };
  
});
