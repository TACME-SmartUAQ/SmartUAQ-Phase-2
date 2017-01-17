var args = arguments[0] || {};
var utilities = require("utilities");
var httpManager = require("httpManager");
var alignment;
var preLang = null;
// $.viewNavigationTools.viewMenu.width = 0;
// $.viewNavigationTools.viewMenu.height = 0;

function changeLanguage() {
	try {
		if (preLang == Alloy.Globals.language) {
			return;
		}
		preLang = Alloy.Globals.language;

		$.viewLeftPanel.setLanguage();
		$.viewHappinessIndicator.changeLanguage();
		$.viewNotification.changeLanguage();

		$.lblNavTitle.text = Alloy.Globals.selectedLanguage.feedback;

		$.textfieldFirstName.value = "";
		$.textfieldLastName.value = "";
		$.textfieldEmail.value = "";
		$.textfieldCountry.value = "";
		$.textfieldMobile.value = "";
		$.textAreaComments.value = "";

		$.textfieldFirstName.hintText = Alloy.Globals.selectedLanguage.firstName + ":";
		$.textfieldLastName.hintText = Alloy.Globals.selectedLanguage.lastName + ":";
		$.textfieldEmail.hintText = Alloy.Globals.selectedLanguage.emailAddress + ":";
		$.textfieldMobile.hintText = Alloy.Globals.selectedLanguage.mobilenumberHinttxt + ":";
		$.textfieldCountry.hintText = Alloy.Globals.selectedLanguage.country + ":";
		$.labelComments.text = Alloy.Globals.selectedLanguage.comments;
		if (Alloy.Globals.isEnglish) {
			$.btnSubmit.left = $.btnCancel.right = 0;
			$.btnSubmit.right = $.btnCancel.left = undefined;
			$.labelFirstName.left = 0;
			$.labelFirstName.right = undefined;
			$.labelLastName.left = 0;
			$.labelLastName.right = undefined;
			$.labelEmail.left = 0;
			$.labelEmail.right = undefined;
			$.labelMobile.left = 0;
			$.labelMobile.right = undefined;
			$.labelCommentStar.left = 0;
			$.labelCommentStar.right = undefined;
			$.imageviewNationalityDropDown.left = undefined;
			$.imageviewNationalityDropDown.right = 0;
			$.btnSubmit.title = Alloy.Globals.selectedLanguage.submit;
			$.btnCancel.title = Alloy.Globals.selectedLanguage.cancel;
			$.labelComments.textAlign = $.textAreaComments.textAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT; 
			$.textfieldFirstName.textAlign = $.textfieldLastName.textAlign = $.textfieldEmail.textAlign = $.textfieldCountry.textAlign = $.textfieldMobile.textAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT;
		} else {
			$.btnSubmit.left = $.btnCancel.right = undefined;
			$.btnSubmit.right = $.btnCancel.left = 0;
			$.labelFirstName.left = undefined;
			$.labelFirstName.right = 0;
			$.labelLastName.left = undefined;
			$.labelLastName.right = 0;
			$.labelEmail.left = undefined;
			$.labelEmail.right = 0;
			$.labelMobile.left = undefined;
			$.labelMobile.right = 0;
			$.labelCommentStar.left = undefined;
			$.labelCommentStar.right = 0;
			$.imageviewNationalityDropDown.left = 0;
			$.imageviewNationalityDropDown.right = undefined;
			$.btnSubmit.title = Alloy.Globals.selectedLanguage.submit;
			$.btnCancel.title = Alloy.Globals.selectedLanguage.cancel;
			$.labelComments.textAlign = $.textAreaComments.textAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT; 
			$.textfieldFirstName.textAlign = $.textfieldLastName.textAlign = $.textfieldEmail.textAlign = $.textfieldCountry.textAlign = $.textfieldMobile.textAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
		}
		Ti.API.info('Error ' + e.message);
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function addKeyBoard() {
	try {
		var flexSpace = Titanium.UI.createButton({
			systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});

		var btnDone = Titanium.UI.createButton({
			title : 'Done',
			width : 67,
			height : 32
		});

		btnDone.addEventListener('click', function(e) {
			$.textfieldMobile.blur();
		});

		$.textfieldMobile.keyboardToolbar = [flexSpace, flexSpace, flexSpace, btnDone];
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function winOpen() {
	try {
		// Alloy.Globals.manageEservicesNotification();
		Alloy.Globals.arrWindows.push($.winFeedback);
		$.viewNavigationTools.getView().win = $.mainView;
		$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
		$.viewNavigationTools.setNotificationView($.viewNotification.getView());
		//$.viewBottomMenu.getView().viewBack = $.backView;
		$.viewLeftPanel.getView().changeLanguage = changeLanguage;
		$.viewNavigationTools.getView().transparentView = $.viewTransparent;
		if (OS_IOS) {
			addKeyBoard();
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function closeLeftPanel() {
	$.viewNavigationTools.onMenu();
}

function winFocus(e) {
	try {
		Alloy.Globals.bottomMenu = $.backView;
		$.viewBottomMenu.addInnerMenu();
		Alloy.Globals.currentWindow = e.source.id;
		changeLanguage();
		$.viewLeftPanel.setMenuDirectionView({
			direction : Alloy.Globals.SelectedMenuDirection,
			menuCallback : undefined
		});
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function winClick() {
	$.textAreaComments.blur();
}

function submitFeedback() {
	
	
	
	var formDataValidationStatus = validateMyFeedbackFormData();
	if (formDataValidationStatus==""){
		Ti.API.info('NOW U CAN SEND THE FEEDBACK.......!!!!!!');
		if (Ti.Network.online)
			sendMyFeedBackDataToServer();
		else
			Alloy.Globals.showInternetMsg($.winFeedback);
		return;	
	}else{
		utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, formDataValidationStatus);
	}
	
	
	/*try {
		if ($.textfieldFirstName.value.trim() === "") {
			utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.enterFirstName, function() {
			});
		} else if ($.textfieldLastName.value.trim() === "") {
			utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.enterLastName, function() {
			});
		} else if ($.textfieldEmail.value.trim() === "") {
			utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.mailId, function() {
			});
		} else if ($.textfieldMobile.value.trim() === "") {
			utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.mobileNumber, function() {
			});
		} else if ($.textAreaComments.value.trim() === "") {
			utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.enterComments, function() {
			});
		} else if ($.textfieldMobile.value.length < 10 && $.textfieldMobile.value !== "") {
			utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.mobileLength, function() {
			});
			$.textfieldMobile.value = "";
		} else {
			if ($.textfieldCountry.value === "" || $.textfieldCountry.value === null) {
				$.textfieldCountry.value = " ";
			}
			if (Ti.Network.online) {
				httpManager.submitFeedback($.textfieldFirstName.value, $.textfieldLastName.value, $.textfieldEmail.value, $.textfieldMobile.value, $.textfieldCountry.value, $.textAreaComments.value, function(response) {
					if (response == null)
						return;
					if (response.status == 1) {
						// utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.submitThanks, function(response) {
						//
						// });

						var dialog = Ti.UI.createAlertDialog({
							ok : 0,
							title : Alloy.Globals.selectedLanguage.submitFeedback,
							message : Alloy.Globals.selectedLanguage.submitThanks,
							buttonNames : [Alloy.Globals.selectedLanguage.ok]
						});

						dialog.addEventListener('click', function(e) {
							if (e.index === e.source.ok) {
								Alloy.Globals.gotoHome();
								Alloy.Globals.arrWindows.pop($.winFeedback);
							}
						});

						dialog.show();
					}
				});
			} else {
				Alloy.Globals.showInternetMsg($.winFeedback);
			}
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}*/
}

//var arrCitizenList = [];
function selectCitizenShip() {
	try {
		Ti.API.info('citizencaled on click');
		httpManager.getNationalityLookupForFeedback(function(responce) {
			if (responce != null) {
				Ti.API.info('>>>>>>>' + JSON.stringify(responce));
				Alloy.createController("winSelection", {
					data : responce,
					title : Alloy.Globals.selectedLanguage.country,
					callBackFunction : setNationality
				}).getView().open();
			}
		});
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

function setNationality(e) {
	$.textfieldCountry.value = (Alloy.Globals.isEnglish) ? e.obj.title : e.obj.titleAr;
}

/*function validateMail() {
	try {
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		var result = re.test($.textfieldEmail.value);
		if ($.textfieldEmail.value !== "") {
			if (result == 0) {
				$.textfieldEmail.value = "";
				utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.invalidmail, function() {
				});
			}
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}*/

/*function validateMobile() {
	try {
		var f_val = $.textfieldMobile.value.replace(/[^0-9+]/g, "");
		f_val = f_val.replace(/[_-]/g, " ");
		$.textfieldMobile.value = (f_val.length == 1 || f_val.length == 0) ? f_val : f_val.slice(0, 3) + "-" + f_val.slice(3, 10);
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}*/

/*
function validateName(e) {
	try {
		switch(e.source.id) {
		case "textfieldFirstName" :
			var result = checkNameExpression($.textfieldFirstName.value);
			if ($.textfieldFirstName.value !== "") {
				if (result == 0) {
					$.textfieldFirstName.value = "";
					utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.allowAlphabets, function() {
					});
				}
			}
			break;

		case "textfieldLastName" :
			var result = checkNameExpression($.textfieldLastName.value);
			if ($.textfieldLastName.value !== "") {
				if (result == 0) {
					$.textfieldLastName.value = "";
					utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.allowAlphabets, function() {
					});
				}
			}
			break;

		case "textfieldCountry" :
			var result = checkNameExpression($.textfieldCountry.value);
			if ($.textfieldCountry.value !== "") {
				if (result == 0) {
					$.textfieldCountry.value = "";
					utilities.showAlert(Alloy.Globals.selectedLanguage.submitFeedback, Alloy.Globals.selectedLanguage.allowAlphabets, function() {
					});
				}
			}
			break;
		}
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}*/

/*function checkNameExpression(value) {
	return /^[A-z ]+$/.test(value);
}*/
// VALIDATION OF FORM FIELDs
function validateMyFeedbackFormData (){
	Ti.API.info('COME TO VALIDATE');
	var errMsg = "";
	
	/// If user has entered email address then it goes to validate to valid email address or not..?
	/*if ($.textfieldEmail.value.trim().length != 0){
		if(utilities.isValidEmail($.textfieldEmail.value)==false){
			errMsg+="\n"+Alloy.Globals.selectedLanguage.valid_email_err;
		}
	}*/
	
	// CHECKING - REQUIRED FIELD COMMENTS
	if ($.textAreaComments.value.trim().length == 0){
		errMsg+="\n"+Alloy.Globals.selectedLanguage.blank_comment;
	}
	
	// CHECKING - REQUIRED FIELD SUGGESTIONS
	/*if ($.textfieldSuggestion.value.trim().length==0){
		errMsg+="\n"+Alloy.Globals.selectedLanguage.blank_suggestion;
	}*/
	
	// CHECKING & VALIDATE - FIRST NAME
	if ($.textfieldFirstName.value.trim().length == 0){
		errMsg+="\n"+Alloy.Globals.selectedLanguage.fname_req;
	}
	else{
		var fieldStatus=utilities.validateCharacters($.textfieldFirstName.value);
			Ti.API.info('fieldStatus(Fname): '+ fieldStatus);
			if (fieldStatus==false){
				errMsg+="\n"+Alloy.Globals.selectedLanguage.valid_first_name;
			}
	}
	
	// CHECKING & VALIDATE - LAST NAME
	if ($.textfieldLastName.value.trim().length == 0){
		errMsg+="\n"+Alloy.Globals.selectedLanguage.lname_req;
	}
	else{
		var fieldStatus=utilities.validateCharacters($.textfieldLastName.value);
		Ti.API.info('fieldStatus(Lname): '+ fieldStatus);
			if (fieldStatus==false){
				errMsg+="\n"+Alloy.Globals.selectedLanguage.valid_last_name;
			}
	}
	
	// CHECKING & VALIDATE - EMAIL ADDRESS
	if ($.textfieldEmail.value.trim().length == 0){
		errMsg+="\n"+Alloy.Globals.selectedLanguage.email_req;
	}
	else{
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		var result = re.test($.textfieldEmail.value);
		
	// var fieldStatus=utilities.validateCharacters($.textfieldEmail.value);
		// Ti.API.info('fieldStatus(Fname): '+ fieldStatus);
		if (result == 0){
			errMsg+="\n"+Alloy.Globals.selectedLanguage.mailId;
		}
	}
	
	// CHECKING & VALIDATE - MOBILE NUMBER
	Ti.API.info('LENG::'+$.textfieldMobile.value.trim().length);
	if ($.textfieldMobile.value.trim().length == 0){
		errMsg+="\n"+Alloy.Globals.selectedLanguage.mobilereq;
	}
	else {
		if($.textfieldMobile.value.trim().length < 10){
			errMsg+="\n"+Alloy.Globals.selectedLanguage.invalidMobile;
		}
		if ($.textfieldMobile.value.trim().length > 10){
			errMsg+="\n"+Alloy.Globals.selectedLanguage.invalidMobile;
		}
	}
	if ($.textfieldMobile.value.trim().length == 10){
		Ti.API.info(' match res: '+ $.textfieldMobile.value.match(/[^\0-9]/g));
		if ($.textfieldMobile.value.match(/[^\0-9]/g) == null){
			Ti.API.info('valid numbers');
		}
		else{
			errMsg+="\n"+Alloy.Globals.selectedLanguage.invalidMobile;
		}
	}
	Ti.API.info('ERR MSG: '+errMsg);
	return errMsg;
};



// SEND ALL FORM DATA TO SERVER
function sendMyFeedBackDataToServer(){
	try{
		if (Ti.Network.online) {
			httpManager.submitFeedback($.textfieldFirstName.value, $.textfieldLastName.value, $.textfieldEmail.value, $.textfieldMobile.value, $.textfieldCountry.value, $.textAreaComments.value, function(response) {
				if (response == null)
					return;
				if (response.status == 1) {
					
					var dialog = Ti.UI.createAlertDialog({
						ok : 0,
						title : Alloy.Globals.selectedLanguage.appTitle,
						message : Alloy.Globals.selectedLanguage.submitThanks,
						buttonNames : [Alloy.Globals.selectedLanguage.ok]
					});

					dialog.addEventListener('click', function(e) {
						if (e.index == 0) {
							closeWindow();
						}
					});
					dialog.show();
				}
			});
		} else {
			Alloy.Globals.showInternetMsg($.winFeedback);
		}
	}
	catch(e){
		Ti.API.info('ERROR IN SEND SUGGESTION DATA TO SERVER'+JSON.stringify(e));
	}
};

function closeWindow() {
	try {
		if (args.isFromMenu) {
			Alloy.Globals.gotoHome();
			return;
		}
		Alloy.Globals.arrWindows.pop($.winFeedback);
		$.winFeedback.close();
	} catch(e) {
		Ti.API.info('Error ' + e.message);
	}
}

changeLanguage();
