var args = arguments[0] || {};
var title = arguments[0].title;
var directWalkin = arguments[0].walking;
var accountIDwalking = arguments[0].accountIdw;

var httpManager = require("httpManager");
var utilities = require("utilities");

var preLang = null;
var selectedEmirates = "";
var accountID = "";
if(directWalkin == "true"){
	accountID = accountIDwalking;
}

var userObj =[];

function changeLanguage() {
	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;
	//alert(title); //ßalert(Alloy.Globals.selectedLanguage.CompleteRegProcess);
		
	$.lblNavTitle.text = (title == "OTP")? Alloy.Globals.selectedLanguage.CompleteRegProcess: Alloy.Globals.selectedLanguage.activateAccount;
	
	$.txtOTP.hintText = Alloy.Globals.selectedLanguage.OTPtxt + ":";
	
	$.sendanotherOTPId.text =   Alloy.Globals.selectedLanguage.sendAnotherOTP;
	$.lblIndividualUser.text = Alloy.Globals.selectedLanguage.individualUserTxt;
	$.lblEstablishUser.text = Alloy.Globals.selectedLanguage.establishUserTxt;
	$.mobileNumTxt.hintText = Alloy.Globals.selectedLanguage.mobilenumberHinttxt;
	//$.emmiratesIdorPassTxt.hintText = Alloy.Globals.selectedLanguage.emiratesIDorPassport;
	$.emmiratesIDTxt.hintText = Alloy.Globals.selectedLanguage.emiratedId;
	$.passpoerNumTxt.hintText = Alloy.Globals.selectedLanguage.passportNum;
	$.mobileNumTxtEstblish.hintText = Alloy.Globals.selectedLanguage.mobilenumberHinttxt;
	$.tradeLicencseNumTxt.hintText = Alloy.Globals.selectedLanguage.tradeLicenceNumber;
	$.textfieldEmirates.hintText= Alloy.Globals.selectedLanguage.chooseEmirates;
	
	$.lblORtext.text=  Alloy.Globals.selectedLanguage.or;
	
	if(title == "OTP"){
		$.otpViewContainer.visible = true;
		$.activateContainerView.visible = false;
		$.activateContainerView.width =0;
		$.activateContainerView.height=0;
	}else{
		$.activateContainerView.visible = true;
		$.otpViewContainer.visible = false;
		$.otpViewContainer.width =0;
		$.otpViewContainer.height=0;
	}
				
	if(Alloy.Globals.isEnglish){
		
		$.imageviewEmirates.right =  0;
		$.imageviewEmirates.left = undefined;
		alignment = Titanium.UI.TEXT_ALIGNMENT_LEFT;
	} else {
		
		$.imageviewEmirates.left =  0;
		$.imageviewEmirates.right = undefined;
		alignment = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
	}
	//#### show individual user text fileds #### // doneTitle
	    showIndividual();
	
}
function addKeyBoardDone(){
	var flexSpace = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var btnDone = Titanium.UI.createButton({    
	    title : Alloy.Globals.selectedLanguage.doneTitle,
	    width : 67,
	    height : 32
	});
	
	btnDone.addEventListener('click',function(e){
	    $.mobileNumTxt.blur();
	});
	
	
	$.mobileNumTxt.keyboardToolbar = [flexSpace, flexSpace,flexSpace, btnDone];
}

Ti.Platform.name == 'android' ? '' : addKeyBoardDone();
function addKeyBoardDone1(){
	var flexSpace = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var btnDone = Titanium.UI.createButton({    
	    title : Alloy.Globals.selectedLanguage.doneTitle,
	    width : 67,
	    height : 32
	});
	
	btnDone.addEventListener('click',function(e){
	    $.emmiratesIDTxt.blur();
	});
	
	
	$.emmiratesIDTxt.keyboardToolbar = [flexSpace, flexSpace,flexSpace, btnDone];
}
Ti.Platform.name == 'android' ? '' : addKeyBoardDone1();
function addKeyBoardDone2(){
	var flexSpace = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var btnDone = Titanium.UI.createButton({    
	    title : Alloy.Globals.selectedLanguage.doneTitle, 
	    width : 67,
	    height : 32
	});
	
	btnDone.addEventListener('click',function(e){
	    $.mobileNumTxtEstblish.blur();
	});
	
	
	$.mobileNumTxtEstblish.keyboardToolbar = [flexSpace, flexSpace,flexSpace, btnDone];
}
Ti.Platform.name == 'android' ? '' : addKeyBoardDone2();



function doIndividualUser(e){ Ti.API.info('individual info' + JSON.stringify(e));
	chnageUserTypeONclick(e.source.isSelected, "INDIVID");
}

function doEstablishUser(e){
	chnageUserTypeONclick(e.source.isSelected, "ESTABLISH");
}

function chnageUserTypeONclick(status, userType){
   if(userType == 'INDIVID')
   { Ti.API.info("individual  "+status);
   	 (status == false)? showIndividual() : "";
   }else{
   	Ti.API.info("ESTABLISH  "+status);
   	(status == false)? showEstablish() : "";
   }

}

function showIndividual(){
	    $.individualView.width = undefined;
   	   	$.individualView.height = 180;
		$.establishedView.width =0;
   	   	$.establishedView.height =0;
   	   	$.imageviewIndividualUser.backgroundImage =  Alloy.Globals.path.radioActive;
   	   	$.imageviewEstablishUser.backgroundImage =  Alloy.Globals.path.radioInactive;
   	   	$.viewIndividualSetting.isSelected = true;
   	   	$.viewEstablishSetting.isSelected = false;
   	   	resetValues();
   	   	//$.lblValidationTxt.show();
   	   
}
function showEstablish(){
	    $.establishedView.width = undefined;
   	   	$.establishedView.height = 180;
		$.individualView.width =0;
   	   	$.individualView.height =0; 	   
   	   	$.imageviewIndividualUser.backgroundImage =  Alloy.Globals.path.radioInactive;
   	   	$.imageviewEstablishUser.backgroundImage =  Alloy.Globals.path.radioActive;
   	    $.viewIndividualSetting.isSelected = false;
   	   	$.viewEstablishSetting.isSelected = true;
   	     resetValues();
   	   	//$.lblValidationTxt.hide();
}


function setSelectedEmiratesActivation(e) {
  $.textfieldEmirates.value = (Alloy.Globals.isEnglish) ? e.obj.title : e.obj.titleAr;
  selectedEmirates =   e.obj.id;
}

var arrEmiratesList = [];
function selectEmiratesActivation(){
	if (arrEmiratesList.length == 0) {
		httpManager.getEmiratesLookUp(function(responce) {
			if (responce != null) {
				Ti.API.info('>>>>>>>' + JSON.stringify(responce));
				arrEmiratesList = responce;
				Alloy.createController("winSelection", {
					data : arrEmiratesList,
					title : Alloy.Globals.selectedLanguage.chooseEmirates,
					callBackFunction : setSelectedEmiratesActivation
				}).getView().open();
			}
		});
	} else {
		Alloy.createController("winSelection", {
			data : arrEmiratesList,
			title : Alloy.Globals.selectedLanguage.chooseEmirates,
			callBackFunction : setSelectedEmiratesActivation
		}).getView().open();
	}

}
function resetValues() {
	 $.textfieldEmirates.value = "";
	 $.emmiratesIDTxt.value = "";
	 $.mobileNumTxt.value = "";
	 $.mobileNumTxtEstblish.value  = "";
	 $.tradeLicencseNumTxt.value = "";
	 $.passpoerNumTxt.value = "";
}

function checkNumber(no) {
    return !no.match(/[^0-9+]/g);
}
function onResendOTP(){
	
	var typeofUserChoosen = ($.viewIndividualSetting.isSelected) ? 1: 2;
	
	 httpManager.generateOTPresend(userObj, typeofUserChoosen,function(responce) {
			if (responce != null) {
				Ti.API.info('>>>>>>>' + JSON.stringify(responce));
				
			}
		});
}
function onSubmitOTP(){
	//Alloy.Globals.openWindow(Alloy.createController('UserManagement/Registration/winActivateAccount', {title:"INDIVIDUAL"}).getView());
	//Alloy.Globals.openWindow(Alloy.createController('UserManagement/Registration/winActivateAccount', {title:"ESTABLISH"}).getView());
	 if ($.txtOTP.value.length == 0) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.plzEnterOTP);
			statusValid = false;
			return  statusValid;
      }
       var tokenOTP = $.txtOTP.value;
       httpManager.validateOTPwebService(accountID, tokenOTP,function(responce) {
			if (responce != null) {
				Ti.API.info('>>>>>>>' + JSON.stringify(responce));
				closeWindow();
			}
		});
}
$.emmiratesIDTxt.addEventListener('focus', function(e) {
	$.emmiratesIDTxt.value = e.source.value.replace(/[-]/gi, "");
	$.emmiratesIDTxt.maxLength = 15;
	
});	
$.emmiratesIDTxt.addEventListener('blur', function(e) {
	if (e.source.value.length == 0) {
		return;
	}
	$.emmiratesIDTxt.maxLength = 18;
	var f_val = e.source.value.replace(/[^0-9]/g, "");
	f_val = f_val.replace(/[_-]/g, " ");
	e.source.value = (f_val.length == 1 || f_val.length == 0) ? f_val : f_val.slice(0, 3) + "-" + f_val.slice(3, 7) + "-" + f_val.slice(7, 14) + "-" + f_val.slice(14, 15);

});
$.mobileNumTxt.addEventListener('focus', function(e) {
	$.mobileNumTxt.value = e.source.value.replace(/[-]/gi, "");
	$.mobileNumTxt.maxLength = 10;
	
});
$.mobileNumTxt.addEventListener('blur', function(e) {
	if (e.source.value.length == 0) {
		return;
	}
    $.mobileNumTxt.maxLength = 11;
	var f_val = e.source.value.replace(/[^0-9]/g, "");
	e.source.value = (f_val.length == 0) ? f_val : f_val.slice(0, 3) + "-" + f_val.slice(3, 10);

});
$.mobileNumTxtEstblish.addEventListener('focus', function(e) {
	$.mobileNumTxtEstblish.value = e.source.value.replace(/[-]/gi, "");
	$.mobileNumTxtEstblish.maxLength = 10;
	
});
$.mobileNumTxtEstblish.addEventListener('blur', function(e) {
     if (e.source.value.length == 0) {
		return;
	}
	$.mobileNumTxtEstblish.maxLength = 11;
	var f_val = e.source.value.replace(/[^0-9]/g, "");
	e.source.value = (f_val.length == 0) ? f_val : f_val.slice(0, 3) + "-" + f_val.slice(3, 10);

});

function onSubmitActivation(){
	 
	 var mob_val = $.mobileNumTxt.value.replace(/[^0-9]/g, "");
	 //$.mobileNumTxt.value = (mob_val.length == 0) ? mob_val : mob_val.slice(0, 3) + "-" + mob_val.slice(3, 10);
	 
	 var mob_val2 = $.mobileNumTxtEstblish.value.replace(/[^0-9]/g, "");
	 //$.mobileNumTxtEstblish.value = (mob_val2.length == 0) ? mob_val2 : mob_val2.slice(0, 3) + "-" + mob_val2.slice(3, 10);
	 
	 //var f_valEm = $.emmiratesIDTxt.value.replace(/[^0-9]/g, "");
	//f_valEm = f_valEm.replace(/[_-]/g, " ");
	//$.emmiratesIDTxt.value = (f_valEm.length == 1 || f_valEm.length == 0) ? f_valEm : f_valEm.slice(0, 3) + "-" + f_valEm.slice(3, 7) + "-" + f_valEm.slice(7, 14) + "-" + f_valEm.slice(14, 15);
    //Ti.API.info('emirate id ' +f_valEm);
	 
     Ti.API.info("on  submit actiavtion"+$.viewIndividualSetting.isSelected);

     if(($.viewIndividualSetting.isSelected))
     { 
	    if ($.mobileNumTxt.value.trim().length == 0) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.plzMobileNumber);
			statusValid = false;
			return  statusValid;
		}
		if(mob_val.trim().length != 10){
				utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.enterValidMobile);
				statusValid = false;
				return  statusValid;
	    }
	    if((checkNumber($.mobileNumTxt.value.trim()) == false)  && (mob_val.length !=10))
		{
			utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.enterValidMobile);
			return  false;
		}
		var emiratesidcount = $.emmiratesIDTxt.value.replace(/[-]/gi, "");
		Ti.API.info('emirate id ' +emiratesidcount);
		if (emiratesidcount.trim().length != 15 && $.emmiratesIDTxt.value.trim().length > 0) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.plzValidEmiratesId);
			//$.emmiratesIDTxt.value = "";
			return false;
		}
		if ($.emmiratesIDTxt.value.trim().length == 0 && $.passpoerNumTxt.value.trim().length == 0) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.plzEmiratesOrPassportId);
			return  false;
		}
	   
	 }else {	
		if ($.mobileNumTxtEstblish.value.trim().length == 0) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.plzMobileNumber);
			return  false;
		}
		if(mob_val2.trim().length != 10){
				utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.enterValidMobile);
				statusValid = false;
				return  statusValid;
	    }
	    if((checkNumber($.mobileNumTxtEstblish.value.trim()) == false)  && (mob_val2.trim().length !=10))
		{
			utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.enterValidMobile);
			return  false;
		}  //tradeLicencseNumTxt
		if ($.tradeLicencseNumTxt.value.trim().length == 0) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.plzTradeLicNum);
			return  false;
		}
		if ($.textfieldEmirates.value.trim().length == 0) {
			utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.plzChooseEmirates);
			return  false;
		}
		
	}
	
	
	var typeofUserChoosen = ($.viewIndividualSetting.isSelected) ? 1: 2;
	
	
	
	var obj = {
			mobileno : $.mobileNumTxt.value.replace(/[-]/gi, ""),
			emiratesId : $.emmiratesIDTxt.value.replace(/[-]/gi, ""),
			passpoertno:$.passpoerNumTxt.value,
			userType: typeofUserChoosen,
			mobileNoEst : $.mobileNumTxtEstblish.value.replace(/[-]/gi, ""),
			tradelicense : $.tradeLicencseNumTxt.value,
			emiratesCode: selectedEmirates,
	    };
	Ti.API.info('>>>>>>>' + JSON.stringify(obj));	
	
    httpManager.getAccountDetails(obj, function(responce) {
			if (responce != null) {
				Ti.API.info('>>>>>>>' + JSON.stringify(responce));
				//closeWindow();
				userActivationStatusChange(responce);
			}
		});
}

function userActivationStatusChange(responce){
	Ti.API.info('status id>>>>>>>' + JSON.stringify(responce.user_Details.actStatusId)+ "account id" + responce.user_Details.accountId);
	
	accountID = responce.user_Details.accountId;
	
	userObj = {
		accountID : responce.user_Details.accountId,
		mobileno : responce.user_Details.mobileNo,
		tradelicense : responce.account_details.tradeLienceNo,
		emiratesId : responce.account_details.emiratesId,
		emiratesCode : responce.account_details.emiratesCode,
		passportNo : responce.account_details.passportNo,
	};
	
	var accountStatusID = responce.user_Details.actStatusId; 
	var userRegFrontEnd = responce.user_Details.sourceId; 
	// TO DO
	//accountStatusID =2;
	//userRegFrontEnd =2; 
	
	// User who are register front end will go through this process
  
	if(userRegFrontEnd == 2 && accountStatusID != 2 && accountStatusID != 4 && accountStatusID != 3){
		//if()
		
		Alloy.Globals.openWindow(Alloy.createController('UserManagement/Registration/winActivateAccount', {
						data : responce,
						title : ($.viewIndividualSetting.isSelected)? "INDIVIDUAL" : "ESTABLISH"
						//callBackFunction : setSelectTradeLicense
					}).getView());
		closeWindow();                
		return;
	}
	
	if(accountStatusID == 1){
		// Just registered user
		  utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.yourAccountIsNotVerified);
	}
	if(accountStatusID == 2){
		// Registration verifed and OTP is send to the user
		title = "OTP";
		$.otpViewContainer.visible = true;
		$.activateContainerView.visible = false;
		$.otpViewContainer.width =undefined;
		$.otpViewContainer.height=undefined;
		$.activateContainerView.width =0;
		$.activateContainerView.height=0;
	}
	if(accountStatusID == 3){
		// OTP is validated and email is send
		utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.validateYouraccountOTP);
	}
	if(accountStatusID == 4){
		// Email is validated and account is active for login
		utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.youAccountisActive);
	}
	
	
	
}

function closeOTPwin(){
	 closeWindow();
}

function winOpen(){
	Alloy.Globals.hideLoading();
	Alloy.Globals.currentWindowMain = "winSubmitOTPRT";
	Alloy.Globals.arrWindows.push($.winSubmitOTP);
	Ti.API.info(Alloy.Globals.currentWindow+'===window===== leng=='+ Alloy.Globals.arrWindows.length);
	
}
function closeWindow(){
	Alloy.Globals.arrWindows.pop($.winSubmitOTP);
	Alloy.Globals.currentWindowMain = "NoWin";
	$.winSubmitOTP.close();
	Ti.API.info(Alloy.Globals.currentWindowMain+'window leng'+ Alloy.Globals.arrWindows.length);
}
$.winSubmitOTP.addEventListener('android:back', function (e) {
	closeWindow();
});
changeLanguage();