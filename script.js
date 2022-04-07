$(document).ready(function () {

	//Widget Code
	var bot = '<div class="chatCont" id="chatCont" style="background-color: whitesmoke; border-radius: 5px; border: 0; margin-right: 1%">' +
		'<div class="bot_profile">' +
		// '<img src="logo.png" class="bot_p_img" style="box-shadow: 0px 0px 5px #f9813a;">' +
		'<div class="exit" style="float: right; margin-right: 2%; margin-top: 5%;">' +
		'<i class="fa fa-times" aria-hidden="true" style="color: ;"></i>' +
		'</div>' +
		'</div><!--bot_profile end-->' +
		'<div id="result_div" class="resultDiv"></div>' +
		'<div class="chatForm" id="chat-div">' +
		'<div class="spinner">' +
		'<div class="bounce1"></div>' +
		'<div class="bounce2"></div>' +
		'<div class="bounce3"></div>' +
		'</div>' +
		'<div class="input-group mb-3" style="background-color: whitesmoke; border-radius: 5px;">' +
		  '<input type="text" id="chat-input" autocomplete="on" placeholder="Type your message...."' + 'class="form-control bot-txt" style="border: 0px; border-radius: 25px; background-color: #fff; padding-left: 5%; margin-left: 10px; margin-top: 10px; margin-bottom: 10px; height: 50px; box-shadow: 1px 1px 5px #ccc;"/>' +
		  '<div class="input-group-append">' +
		    '<button class="btn" type="button" style="background-color: #1565b1; margin-top:10px; margin-right: 5px; margin-left: 8px; border-radius: 50%; width: 50px; height: 50px"><i class="fa fa-paper-plane" aria-hidden="true" style="color: #fff; font-size: 1.5rem;"></i></button>' +
		  '</div>' +
		'</div>' +
		'</div>' +
		'</div><!--chatCont end-->' +

		'<div class="profile_div">' +
		'<div class="col-hgt col-sm-offset-2">' +
		'<img src="logo2.png" class="img-circle img-profile">' +
		'</div><!--col-hgt end-->' +
		'</div><!--profile_div end-->';


	$("mybot").html(bot);

	// ------------------------------------------ Toggle chatbot -----------------------------------------------
	$('.profile_div').click(function () {
		$('.profile_div').toggle();
		$('.chatCont').toggle();
		$('.bot_profile').toggle();
		$('.chatForm').toggle();
		document.getElementById('chat-input').focus();
	});

	$('.exit').click(function () {
		$('.profile_div').toggle();
		$('.chatCont').toggle();
		$('.bot_profile').toggle();
		$('.chatForm').toggle();
	});




	// on input/text enter--------------------------------------------------------------------------------------
	$('#chat-input').on('keyup keypress', function (e) {
		var keyCode = e.keyCode || e.which;
		var text = $("#chat-input").val();
		if (keyCode === 13) {
			if (text == "" || $.trim(text) == '') {
				e.preventDefault();
				return false;
			} else {
				$("#chat-input").blur();
				setUserResponse(text);
				send(text);
				e.preventDefault();
				return false;
			}
		}
	});

	// on input/text send button--------------------------------------------------------------------------------------
	$('.btn').click(function (){
		var text = $("#chat-input").val();
		if (text == "" || $.trim(text) == '') {
				e.preventDefault();
				return false;
			} else {
				$("#chat-input").blur();
				setUserResponse(text);
				send(text);
				e.preventDefault();
				return false;
			}
	});


	//------------------------------------------- Call the RASA API--------------------------------------
	function send(text) {


		$.ajax({
			// url: 'https://tambua-project.herokuapp.com/webhooks/rest/webhook', //  RASA API
			url: 'http://localhost:5005/webhooks/rest/webhook', //  RASA API
			
			type: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				"sender": "user", //add the user ID here
				"message": text,
				// "name": "action_welcome_message",
				// "policy": "MappingPolicy",
				// "confidence": "0.98723"
			}),
			success: function (data, textStatus, xhr) {
				console.log(data);

				if (Object.keys(data).length !== 0) {
					for (i = 0; i < Object.keys(data[0]).length; i++) {
						if (Object.keys(data[0])[i] == "buttons") { //check if buttons(suggestions) are present.
							addSuggestion(data[0]["buttons"])
						}

					}
				}

				setBotResponse(data);

			},
			error: function (xhr, textStatus, errorThrown) {
				console.log('Error in Operation');
				setBotResponse('error');
			}
		});





	}


	//------------------------------------ Set bot response in result_div -------------------------------------
	function setBotResponse(val) {
		setTimeout(function () {

			if ($.trim(val) == '' || val == 'error') { //if there is no response from bot or there is some error
				val = "Sorry, I didn't understand what you said can you rephrase?"
				var BotResponse = '<p class="botResult">' + val + '</p><div class="clearfix"></div>';
				$(BotResponse).appendTo('#result_div');
			} else {

				//if we get message from the bot succesfully
				var msg = "";
				for (var i = 0; i < val.length; i++) {
					if (val[i]["image"]) { //check if there are any images
						msg += '<p class="botResult"><img  width="200" height="124" src="' + val[i].image + '/"></p><div class="clearfix"></div>';
					} else {
						msg += '<p class="botResult">' + val[i].text + '</p><div class="clearfix"></div>';
					}

				}
				BotResponse = msg;
				$(BotResponse).appendTo('#result_div');
			}
			scrollToBottomOfResults();
			hideSpinner();
		}, 500);
	}


	//------------------------------------- Set user response in result_div ------------------------------------
	function setUserResponse(val) {
		var UserResponse = '<p class="userEnteredText">' + val + '</p><div class="clearfix"></div>';
		$(UserResponse).appendTo('#result_div');
		$("#chat-input").val('');
		scrollToBottomOfResults();
		showSpinner();
		$('.suggestion').remove();
	}


	//---------------------------------- Scroll to the bottom of the results div -------------------------------
	function scrollToBottomOfResults() {
		var terminalResultsDiv = document.getElementById('result_div');
		terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
	}


	//---------------------------------------- Spinner ---------------------------------------------------
	function showSpinner() {
		$('.spinner').show();
	}

	function hideSpinner() {
		$('.spinner').hide();
	}




	//------------------------------------------- Buttons(suggestions)--------------------------------------------------
	function addSuggestion(textToAdd) {
		setTimeout(function () {
			var suggestions = textToAdd;
			var suggLength = textToAdd.length;
			$('<p class="suggestion"></p>').appendTo('#result_div');
			// Loop through suggestions
			for (i = 0; i < suggLength; i++) {
				$('<span class="sugg-options">' + suggestions[i].title + '</span>').appendTo('.suggestion');
			}
			scrollToBottomOfResults();
		}, 1000);
	}


	// on click of suggestions get value and send to RASA
	$(document).on("click", ".suggestion span", function () {
		var text = this.innerText;
		setUserResponse(text);
		send(text);
		$('.suggestion').remove();
	});
	// Suggestions end -----------------------------------------------------------------------------------------


});


var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}