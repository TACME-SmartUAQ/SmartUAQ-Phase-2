var utilities = require("utilities");
var httpManager = require("httpManager");
var textfieldsArray = [$.textfieldLandmark, $.textAreaComments, $.textfieldFirstName, $.textfieldLastName, $.textfieldEmail, $.textfieldPhoneNo];
//ADD THE KEYBOARD TOOLBAR
function addUserKeyBoard(){
	var flexSpace = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var btnDone = Titanium.UI.createButton({    
	    title : 'Done',
	    width : 67,
	    height : 32
	});
	btnDone.addEventListener('click',function(e){
	    $.textfieldPhoneNo.blur();
	});
	$.textfieldPhoneNo.keyboardToolbar = [flexSpace, flexSpace,flexSpace, btnDone];
}


var arrOptions = [];
var uploadedPhotoId = null;
var categoryId = null;

var categoryName_english = null;
var categoryName_arebic = null;
//OPTION DIALOG
var mediaOptionDialog = Titanium.UI.createOptionDialog({
	options : arrOptions,
	cancel : 2,
});
mediaOptionDialog.addEventListener('click', function(e) {
	if (e.index == 0) {
		showCamera();
	} else if (e.index == 1) {
		choosePhotoGallery();
	}
});
//VALIDATE SUGGESTION FORM
function validateSuggestionForm(){
	var formDataValidationStatus = validateSuggestionFormData();
	if (formDataValidationStatus==""){
		Ti.API.info('NOW U CAN SEND THE SUGGESTION.......!!!!!!');
		if (Ti.Network.online)
			sendSuggestionDataToServer();
		else
			//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
			Alloy.Globals.showInternetMsg($.winSuggestions);
	}else{
		utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, formDataValidationStatus);
	}
};
//CHANGE LANGUAGE
var alignment;
var preLang = null;
function changeLanguage() {
	
	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;
	arrOptions = [Alloy.Globals.selectedLanguage.useCamera, Alloy.Globals.selectedLanguage.selectFromGallery];
	if (OS_IOS) {
		arrOptions.push(Alloy.Globals.selectedLanguage.cancel);
	}
	mediaOptionDialog.options = arrOptions;
	
	$.viewLeftPanel.setLanguage();
	$.viewHappinessIndicator.changeLanguage();
	$.viewNotification.changeLanguage();
	
	$.lblNavTitle.text = Alloy.Globals.selectedLanguage.mysuggestions;
	
	$.labelLocationValue.text = "";
	
	$.textfieldLandmark.hintText = Alloy.Globals.selectedLanguage.enterLandmark + ":";
	$.textfieldSuggestion.hintText = Alloy.Globals.selectedLanguage.suggestions + ":";
	
	$.textfieldFirstName.hintText = Alloy.Globals.selectedLanguage.firstName + ":";
	$.textfieldLastName.hintText = Alloy.Globals.selectedLanguage.lastName + ":";
	$.textfieldEmail.hintText = Alloy.Globals.selectedLanguage.emailAddress + ":";
	$.textfieldPhoneNo.hintText = Alloy.Globals.selectedLanguage.mobileNo + ":";
	
	$.labelComments.text = Alloy.Globals.selectedLanguage.comments;
	$.labelLocationTitle.text = Alloy.Globals.selectedLanguage.location;
	$.labelPhotoUploadInfo.text = Alloy.Globals.selectedLanguage.photoupload_info;
	
	$.btnSubmit.title = Alloy.Globals.selectedLanguage.submit;
	$.btnCancel.title = Alloy.Globals.selectedLanguage.cancel;
	
	$.textfieldSuggestion.value = (Alloy.Globals.isEnglish?categoryName_english:categoryName_arebic);
	
	getCurrentLocationAddress();
	
	if(Alloy.Globals.isEnglish){
		
		$.lblStarRight1.visible=false;
		$.lblStarLeft1.visible=true;
		
		$.lblStarRight2.visible=false;
		$.lblStarLeft2.visible=true;
		
		$.lblStarRight3.visible=false;
		$.lblStarLeft3.visible=true;
		
		$.lblStarRight4.visible=false;
		$.lblStarLeft4.visible=true;
		
		$.lblStarRight6.visible = false;
		$.lblStarLeft6.visible = true;
		
		$.btnSubmit.left = $.btnCancel.right = $.imageviewSuggestionDropDown.right = 0;
		$.btnSubmit.right = $.btnCancel.left = $.imageviewSuggestionDropDown.left = undefined;
		
		$.textfieldSuggestion.left = (OS_ANDROID) ? 5 : 10;
		$.textfieldSuggestion.right = 30;
		
		alignment = Titanium.UI.TEXT_ALIGNMENT_LEFT;
	} else {
		$.lblStarRight1.visible=true;
		$.lblStarLeft1.visible=false;
		
		$.lblStarRight2.visible=true;
		$.lblStarLeft2.visible=false;
		
		$.lblStarRight3.visible=true;
		$.lblStarLeft3.visible=false;
		
		$.lblStarRight4.visible=true;
		$.lblStarLeft4.visible=false;
		
		$.lblStarRight6.visible = true;
		$.lblStarLeft6.visible = false;
		
		$.btnSubmit.left = $.btnCancel.right = $.imageviewSuggestionDropDown.right = undefined;
		$.btnSubmit.right = $.btnCancel.left = $.imageviewSuggestionDropDown.left = 0;
		
		$.textfieldSuggestion.left = 30;
		$.textfieldSuggestion.right = (OS_ANDROID) ? 0 : 10;
		
		alignment = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
	}
	$.labelLocationTitle.textAlign = $.labelLocationValue.textAlign = $.labelComments.textAlign = $.textAreaComments.textAlign = $.labelPhotoUploadInfo.textAlign= alignment;
	$.textfieldLandmark.textAlign = $.textfieldSuggestion.textAlign = $.textfieldFirstName.textAlign =$.textfieldLastName.textAlign = $.textfieldPhoneNo.textAlign = $.textfieldEmail.textAlign = alignment;
	$.textfieldLandmark.value = $.textAreaComments.value = $.textfieldFirstName.value =$.textfieldLastName.value = $.textfieldPhoneNo.value = $.textfieldEmail.value = "";
	
	$.scrollviewSuggestion.animate({opacity:1, duration:500});
}
//ADD IMAGE TO PHYSICAL VIEW AND DISPLAY THAT CAPTURED PHOTO
var photoView = null;
//var arrBtnRemove = [];
function AddImageToView(e) {
	
	// Ti.API.info('PHOTO eeee OBJ::: FIRST: '+ JSON.stringify(e.media));
	var resizedImage = e.media.imageAsResized(200, 250);
	try {
		photoView = Ti.UI.createView({
			height : 50,
			width : 50,
			// visible:false,
			index : 0,
		});

		var borderView = Ti.UI.createView({
			height : 45,
			width : 45,
			borderColor : Alloy.Globals.path.grayColor,
			index : 0,
		});
		photoView.add(borderView);
		
		if (Alloy.Globals.isEnglish) {
			photoView.left = 7;
		} else {
			photoView.right = 7;
		}
		var imageView = Ti.UI.createImageView({
			height : 50,
			width : 50,
			imgObj:"imagePhoto",
			image : resizedImage,
			index : 0,
		});
		var btnRemove = Ti.UI.createImageView({
			top : 0,
			right : 0,
			height : 20,
			width : 20,
			image : Alloy.Globals.path.icnClose,
			index : 0,
			buttonType : 'delete'
		});
		
		btnRemove.addEventListener("click",function(e){
			$.scrollviewAttacment.remove(photoView);
			photoView=null;
			$.labelPhotoUploadInfo.show();
			$.imageviewAdd.enabled = true;
			$.imageviewAdd.opacity = 1.0;
		});
		
		//arrBtnRemove.push(btnRemove);
		borderView.add(imageView);
		photoView.add(btnRemove);
		// $.scrollviewAttacment.add(photoView);
		
		if (Ti.Network.online){
			// var imgePhotoBlobObj = $.scrollviewAttacment.children[0].children[0].children[0].image;
			sendUploadedPhotoToServer(Ti.Utils.base64encode(resizedImage).toString());
		}
		else
			//utilities.showAlert(Alloy.Globals.selectedLanguage.internet_err);
			Alloy.Globals.showInternetMsg($.winSuggestions);
	} catch(ex) {
		Ti.API.info('Exception: ' + ex);
	}
}

// This is open camera and attached capture image
function showCamera(arg) {
	try {
		Titanium.Media.showCamera({
			success : AddImageToView,
			cancel : function() {
				Ti.API.info(' Cancelled ');
			},
			error : function(error) {
				if (error.code == 2) {
					utilities.showAlert(Alloy.Globals.selectedLanguage.attachMedia, Alloy.Globals.selectedLanguage.cameraNotAvail);
				}
			},
			allowEditing : true,
			saveToPhotoGallery : true,
			showControls : true,
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
		});
	} catch(ex) {
		Ti.API.info('Error in opening camera:::'+ JSON.stringify(ex));
	}
}

// This function is open device gallery for select image to attached
function choosePhotoGallery(arg) {
	try {
		Titanium.Media.openPhotoGallery({
			success : AddImageToView, // end of success block
			cancel : function() {
				Ti.API.info(' Cancelled ');
			},
			error : function(error) {
				Ti.API.info(' An error occurred!! ');
			},
			allowEditing : true,
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
		});
	} catch(ex) {
		Ti.API.info('Error in opening photo gallery....');
	}
}


function AttachImage(){
	mediaOptionDialog.show();
}
//PASSING DATA TO SUGGESTIONS SCREEN
var suggestionPayload = {
	data : [],
	title : Alloy.Globals.selectedLanguage.suggestions,
	callBackFunction: function(e){
		Ti.API.info('SELECTED DATA*********'+JSON.stringify(e));
		
		categoryName_english = e.categoryName_En;
		categoryName_arebic = e.categoryName_Ar;
		
		$.textfieldSuggestion.value = (Alloy.Globals.isEnglish?e.categoryName_En:e.categoryName_Ar);
		
		categoryId = e.categoryId;
	}
};
function selectSuggestion(){
	Ti.API.info('SUGGESTION CLICK');
	suggestionPayload.title = Alloy.Globals.selectedLanguage.suggestions;
	httpManager.getAllSuggestion(function(getData){
		Ti.API.info('suggestion daTA: '+JSON.stringify(getData));
		suggestionPayload.data = getData;
		Ti.API.info('WHOLE PAY LAOD: '+JSON.stringify(suggestionPayload));
		if (getData.length==0){
			Ti.API.info('NO SUGGESTION DATA:');
		}else{
			Alloy.createController("Suggestion/winSuggestionSelection", suggestionPayload).getView().open();
		}
	});
}
//WINDOW OPEN FUNCTION
function winOpen(){
	// getCurrentLocationAddress();
	Alloy.Globals.arrWindows.push($.winSuggestions);
	$.viewNavigationTools.getView().win = $.mainView;
	$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
	$.viewNavigationTools.setNotificationView($.viewNotification.getView());
	$.viewLeftPanel.getView().changeLanguage = changeLanguage;
	$.viewNavigationTools.getView().transparentView = $.viewTransparent;
	changeLanguage();
	(OS_IOS?addUserKeyBoard():Ti.API.info('andrid'));
}
//HIDE RIGHT PANEL
function closeLeftPanel(){
	$.viewNavigationTools.onMenu();
}
//WINDOW FOCUS FUNCTION
function winFocus(e){
	Alloy.Globals.bottomMenu = $.backView;
	$.viewBottomMenu.addInnerMenu();
	Ti.API.info('CURR. WINNNN : '+ e.source.id);
	Alloy.Globals.currentWindow = "winSuggestions";
	
	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : undefined
	});
	// show push notification panel based upon user is logged in or not?
	// Alloy.Globals.manageEservicesNotification();
}
// FORM SUBMIT CLICK EVENT
function _eventClickSubmit(){
	Ti.API.info('SUBMIT BUTTON CLICK');
	validateSuggestionForm();
};
// CANCEL BUTTON CLICK EVENT
function _eventClickCancel(){
	var a = Ti.UI.createAlertDialog({
		title : Alloy.Globals.selectedLanguage.appTitle,
		message : Alloy.Globals.selectedLanguage.leave_from_suggestion,
		buttonNames : [Alloy.Globals.selectedLanguage.yes, Alloy.Globals.selectedLanguage.no]
	});
	a.addEventListener('click', function(e) {
		if (e.index == 0){
			closeWindow();
		}else{
			return;
		}
	});
	a.show();
	a=null;
};
//CLOSE WINDOW
function closeWindow(){
	Alloy.Globals.arrWindows.pop($.winSuggestions);
	$.winSuggestions.close();
}
//GET CURRENT ADDRESS
function getCurrentLocationAddress(){
	try{
		if (Ti.Network.online){
			 if (Titanium.Geolocation.locationServicesEnabled === false) {
			 	utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.turn_on_location_service);
			 }
			 else{
			 	// Ti.Geolocation.purpose = 'Get Current Location';
                Titanium.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
                Titanium.Geolocation.distanceFilter = 10;
                Titanium.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
			 	Titanium.Geolocation.getCurrentPosition(function(e) {
					if (!e.success || e.error) {
						utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.location_not_determined);
						// $.labelLocationValue.text= "Please select your desired location.";
						return;
					}
					var coords = e.coords;
					coords.isAuthorised = true;
					Ti.API.log('geo - current location: ' + JSON.stringify(coords));
					$.labelLocationValue.lat=coords.latitude;
					$.labelLocationValue.lon=coords.longitude;
					utilities.reverseGeocodingNew(coords.latitude, coords.longitude, function(addressData){
						Ti.API.info('ADREESSSS:S:: '+ JSON.stringify(addressData));
						$.labelLocationValue.text= addressData.results[1].address;
					});
				});
			 }
		}
		else
		{
			//utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.internet_err);
			Alloy.Globals.showInternetMsg($.winSuggestions);
		}
	}
	catch(e){
		Ti.API.info('%%%%%%%%%%%%% Error in Getting current location address.....!!!!!!');
	}
}
// SEND PHOTO (Blob) TO SERVER
function sendUploadedPhotoToServer(photoBlobObj){
	try{
		var objAttch = {
			filename : String(new Date().getTime())+".jpg",
			data : photoBlobObj,
			docName : 'Suggestionphoto'+String(new Date().getTime()),
			docTitle : 'PhotoTitle'+String(new Date().getTime()),
			docType :"Document" 
		};
		
		httpManager.sendUploadedPhotoToServer(function(result){
			if (result==null || result == "error"){
				uploadedPhotoId = null;
				utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.photo_upload_failed);
				$.labelPhotoUploadInfo.show();
			}
			else{
				uploadedPhotoId = result.did;
				utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.photo_uploaded);
				$.labelPhotoUploadInfo.hide();
				$.scrollviewAttacment.add(photoView);
				$.imageviewAdd.enabled = false;
				$.imageviewAdd.opacity = 0.50;
			}
		},objAttch);
	}
	catch(e){
		Ti.API.info('Error in sending photo to server....!!');
	}
}
// SEND ALL FORM DATA TO SERVER
function sendSuggestionDataToServer(){
	try{
		var suggestionData = {
						   'latitude':($.labelLocationValue.lat?$.labelLocationValue.lat:25.5094558),
						   'longitude':($.labelLocationValue.lon?$.labelLocationValue.lon:55.4555029),
						   'landmark':($.textfieldLandmark.value?$.textfieldLandmark.value:"NA"),
						   'suggestionCategoryId':(categoryId?categoryId:"NA"),
						   'comments':($.textAreaComments.value?$.textAreaComments.value:"NA"),
						   'firstName':($.textfieldFirstName.value?$.textfieldFirstName.value:"NA"),
						   'lastName':($.textfieldLastName.value?$.textfieldLastName.value:"NA"),
						   'emailAddress':($.textfieldEmail.value?$.textfieldEmail.value:"NA"),
						   'fileName':'photoFile',
						   'mobileNumber':($.textfieldPhoneNo.value?$.textfieldPhoneNo.value:"NA"),
						   'did':(uploadedPhotoId?uploadedPhotoId:"")};
	
		Ti.API.info('SUGGESTION DATA: '+ JSON.stringify(suggestionData));
		
		httpManager.sendMySuggestion(function(responseResult){
			Ti.API.info('GOT THE RESPONSE FROM SERVER ABOUT SENDING SUGGESTION'+ responseResult);
			if (responseResult=="0"){
				utilities.showAlert(Alloy.Globals.selectedLanguage.appTitle, Alloy.Globals.selectedLanguage.suggestion_sent_failed);
			}else{
				var a = Ti.UI.createAlertDialog({
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : Alloy.Globals.selectedLanguage.suggestion_sent,
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				a.addEventListener('click', function(e) {
					if (e.index == 0){
						closeWindow();
					}else{
						return;
					}
				});
				a.show();
				a=null;
			}
		},suggestionData);
	}
	catch(e){
		Ti.API.info('ERROR IN SEND SUGGESTION DATA TO SERVER'+JSON.stringify(e));
	}
};
// VALIDATION OF FORM FIELDs
function validateSuggestionFormData (){
	Ti.API.info('COME TO VALIDATE');
	var errMsg = "";
	
	/// If user has entered email address then it goes to validate to valid email address or not..?
	if ($.textfieldEmail.value.trim().length != 0){
		if(utilities.isValidEmail($.textfieldEmail.value)==false){
			errMsg+="\n"+Alloy.Globals.selectedLanguage.valid_email_err;
		}
	}
	
	// CHECKING - REQUIRED FIELD COMMENTS
	if ($.textAreaComments.value.trim().length == 0){
		errMsg+="\n"+Alloy.Globals.selectedLanguage.blank_comment;
	}
	
	// CHECKING - REQUIRED FIELD SUGGESTIONS
	if ($.textfieldSuggestion.value.trim().length==0){
		errMsg+="\n"+Alloy.Globals.selectedLanguage.blank_suggestion;
	}
	
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
	
	// CHECKING & VALIDATE - MOBILE NUMBER
	Ti.API.info('LENG::'+$.textfieldPhoneNo.value.trim().length);
	if ($.textfieldPhoneNo.value.trim().length == 0){
		errMsg+="\n"+Alloy.Globals.selectedLanguage.mobilereq;
	}
	else {
		if($.textfieldPhoneNo.value.trim().length < 10){
			errMsg+="\n"+Alloy.Globals.selectedLanguage.invalidMobile;
		}
		if ($.textfieldPhoneNo.value.trim().length > 10){
			errMsg+="\n"+Alloy.Globals.selectedLanguage.invalidMobile;
		}
	}
	if ($.textfieldPhoneNo.value.trim().length == 10){
		Ti.API.info(' match res: '+ $.textfieldPhoneNo.value.match(/[^\0-9]/g));
		if ($.textfieldPhoneNo.value.match(/[^\0-9]/g) == null){
			Ti.API.info('valid numbers');
		}
		else{
			errMsg+="\n"+Alloy.Globals.selectedLanguage.invalidMobile;
		}
	}
	Ti.API.info('ERR MSG: '+errMsg);
	return errMsg;
};
//HIDE KEYBOARD
function onClick(e){
	
	if (e.source.id == "scrollviewAttacment" || e.source.id == "labelLocationValue" || e.source.id =="labelLocationTitle" || e.source.id== "labelPhotoUploadInfo"){
		$.textfieldLandmark.blur();
		$.textAreaComments.blur();
		$.textfieldFirstName.blur();
		$.textfieldLastName.blur();
		$.textfieldEmail.blur();
		$.textfieldPhoneNo.blur();
	}else{
		Ti.API.info('You clicked on another view.');
		return;
	}
};
// WINDOW CLOSE FUNCTION
function winClose(){
	textfieldsArray = null;
	utilities = null;
	httpManager = null;
	
	arrOptions = null;
	uploadedPhotoId = null;
	categoryId = null;
};

// var _eventTextFieldMobileNoChange = function(e){
	// return;
	// e.source.value = e.source.value.replace(/[^0-9]+/, "");
	// e.source.value = e.source.value.slice(0,10);
// };
