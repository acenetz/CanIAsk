/* JavaScript for homepage */

var SpeechToText = {
	settings : {
		placeHolder: "Type your question or use the microphone."
		,questionForm: $('#question-form')
	}
	,init: function(){
		if (('webkitSpeechRecognition' in window)) {
			var $form = SpeechToText.settings.questionForm;

			$form.find('.js-microphone').addClass('l-block-center');
			$form.find('.js-ask-button').removeClass('l-block-center');
			$form.find('#app-question-field').attr("placeholder", SpeechToText.settings.placeHolder);
			SpeechToText.transcript();			
		}
		SpeechToText.formSubmit();
		SpeechToText.keyPressEvent();
	}
	,keyPressEvent: function(){
		var $form = SpeechToText.settings.questionForm;
		
		$form.on("keyup", "#app-question-field", function(){
			if($form.find('#app-question-field').val().length > 0 ){
				$form.find('.js-microphone').removeClass('l-block-center');
				$form.find('.js-ask-button').addClass('l-block-center');
			} else {
				$form.find('.js-microphone').addClass('l-block-center');
				$form.find('.js-ask-button').removeClass('l-block-center');
			}
		});
		
	}
	,formSubmit: function(){
		var $form = SpeechToText.settings.questionForm;
		
		SpeechToText.settings.questionForm.on("submit", function(){
			if($form.find('#app-question-field').val().length > 0 ){
				SpeechToText.getAnswer();
			}
			return false;
		});
		
	}
	,getAnswer: function(){
		var $form = SpeechToText.settings.questionForm
			,dataVal = $form.find('#app-question-field').val();
			
		var getAnswerXHR = $.ajax({
			url: "/CanIAsk/SpeechToText"
			,type: "GET"
			,cache: true
			,data: { question: dataVal }
			,dataType: "json"
			,success: function(obj){
				if(obj.answer){
					$('#answer-container').removeClass("l-display-none").text(obj.answer);
				} else {
					$('#answer-container').removeClass("l-display-none").text("Sorry, we can't find any answer to your question.");
				}
			}
			,error: function(){
				$('#answer-container').removeClass("l-display-none").text("There was a problem find your answer. Please try again.");
			}
		});
	}
	,transcript : function(){
		var $form = SpeechToText.settings.questionForm
			$textField = $form.find('#app-question-field');
		
		var recognizing;
		var recognition = new webkitSpeechRecognition();
		
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onstart = function() {
			recognizing = true;
		}   
		    
		recognition.onend = function(){
			var imgSrc = $form.find('.js-microphone').attr("src").replace("microphone-icon-b", "microphone-icon-a");
			$form.find('.js-microphone').attr("src", imgSrc);
			recognizing = false;
		};
		
		recognition.onresult = function (event) {
		  for (var i = event.resultIndex; i < event.results.length; ++i) {
		    if (event.results[i].isFinal) {
		      	$textField.val($textField.val() + event.results[i][0].transcript);
		    }
		  }
		}
		
		$form.find('.js-microphone').mousedown(function(){
			var $this = $(this);
			timeout = setTimeout(function(){
				var imgSrc = $this.attr("src").replace("microphone-icon-a", "microphone-icon-b");
				$this.attr("src", imgSrc);
				recognition.start();
			    
		    }, 300);
		    return false;
		}).mouseup(function(){
			
			var imgSrc = $(this).attr("src").replace("microphone-icon-b", "microphone-icon-a");
			$(this).attr("src", imgSrc);
			recognition.stop();
			recognizing = false;
			clearTimeout(timeout);
			
			if($textField.val().length > 0 ){
				SpeechToText.getAnswer();
			}
			
		    return false;
		});
		
	}
};

$(function(){
	SpeechToText.init();
});