var args = arguments[0] || {};

var preLang = null;

function changeLanguage() {
	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;
    
    $.lblNavTitle.text = Alloy.Globals.selectedLanguage.termsAndCondition;
    
    $.lblPersonaldata.text =   Alloy.Globals.selectedLanguage.termsPersonaldata;
    $.lblPersonalData1.text =   Alloy.Globals.selectedLanguage.termsPersonaldata1; 
    $.lblPersonalData2.text =   Alloy.Globals.selectedLanguage.termsPersonaldata2; 
    $.lblPersonalData3.text =   Alloy.Globals.selectedLanguage.termsPersonaldata3;
    $.lblPersonalData4.text =   Alloy.Globals.selectedLanguage.termsPersonaldata4;
    $.lblPersonalData5.text =   Alloy.Globals.selectedLanguage.termsPersonaldata5;
    $.lblPersonalData6.text =   Alloy.Globals.selectedLanguage.termsPersonaldata6;
    $.lblPersonalDetails.text =   Alloy.Globals.selectedLanguage.termsPersonalDetails;
   
    
    $.lblDataControler.text =   Alloy.Globals.selectedLanguage.termsDataControler;
    $.lblDataControlerDes.text =   Alloy.Globals.selectedLanguage.termsDataContolerDesc;
    $.lblDataCollection.text =   Alloy.Globals.selectedLanguage.termsDataCollection;
    $.lblDataCollectionDes.text =   Alloy.Globals.selectedLanguage.termsDataCollectionDesc;
    $.lblmethodsofProcess.text =   Alloy.Globals.selectedLanguage.termsMethodOfProcess;
    $.lblmethodsofProcessDes.text =   Alloy.Globals.selectedLanguage.termsMethodProcessDes;
    
    $.lblPlace.text =   Alloy.Globals.selectedLanguage.termsPlace;
    $.lblPlaceDes.text =   Alloy.Globals.selectedLanguage.termsPlaceDes;
    $.lblretentionTime.text =   Alloy.Globals.selectedLanguage.termsRetentionTime;
    $.lblretentionTimeDes.text =   Alloy.Globals.selectedLanguage.termsRetentionTimeDes;
    $.lblUseCollectedData.text =   Alloy.Globals.selectedLanguage.termsUseCollectionData;
    $.lblUseCollectedDataDes.text =   Alloy.Globals.selectedLanguage.termsUseCollectionDataDes;
    $.lblLegalAction.text =   Alloy.Globals.selectedLanguage.termsLegalAction;
    $.lblLegalActionDes.text =   Alloy.Globals.selectedLanguage.termsLegalActionDes;
    $.lblSysLogMaintain.text =   Alloy.Globals.selectedLanguage.termsLogmaintain;
    $.lblSysLogMaintainDes.text =   Alloy.Globals.selectedLanguage.termsLogmaintainDes;
    $.lblInformationNotContain.text =   Alloy.Globals.selectedLanguage.termsInformationNotContain;
    $.lblInformationNotContainDes.text =   Alloy.Globals.selectedLanguage.termsInformationNotContainDes;
    $.lblUAQeGovent.text =   Alloy.Globals.selectedLanguage.termsUAQGovt;
    $.lblUAQeGoventDes1.text =   Alloy.Globals.selectedLanguage.termsUAQGovtDes1;
    $.lblUAQeGoventDes2.text =   Alloy.Globals.selectedLanguage.termsUAQGovtDes2;
    $.lblChangestoPrivacy.text =   Alloy.Globals.selectedLanguage.termsChPrivacy;
    $.lblChangestoPrivacyDes.text =   Alloy.Globals.selectedLanguage.termsChPrivacyDes;
    
    $.lblNoteTerms.text = Alloy.Globals.selectedLanguage.termsNotes;
    
    // $.labelSubscription.text =Alloy.Globals.selectedLanguage.agreetoTermsCond;
    
    //$.lblNavTitle.text = "Accept";
    //$.lblNavTitle.text = "Decline";
    
}	

function acceptTerms(){
	/*if($.viewSubscription.isSelected)
	{
		if (Alloy.Globals.currentWindowMain == "winRegistrationRT") 
		{ 
			return;
		}
		
		Alloy.Globals.openWindow(Alloy.createController('UserManagement/Registration/winRegistration').getView());
	}
	else
	{
		utilities.showAlert(Alloy.Globals.selectedLanguage.registration, Alloy.Globals.selectedLanguage.plzAgreeTheTerms);
	}*/
	// if (Alloy.Globals.currentWindowMain == "winRegistrationRT") 
	// { 
		// return;
	// }
	Ti.App.Properties.setString("isTermsCondtionSet", true);
	//closeWindow();
	Alloy.Globals.openWindow(Alloy.createController('UserManagement/Registration/winRegistration').getView());
	
}

function declineTerms(){
	Ti.App.Properties.setString("isTermsCondtionSet", false);
	closeWindow();
}

/*
function changeCheck(e) {
	if (e.source.isSelected) {
		$.imageviewSubscription.backgroundImage = Alloy.Globals.path.checkInactive;
		Ti.App.Properties.setString("isTermsCondtionSet", false);
	} else {
		$.imageviewSubscription.backgroundImage = Alloy.Globals.path.checkActive;
		Ti.App.Properties.setString("isTermsCondtionSet", true);
	}
	e.source.isSelected = !e.source.isSelected;
}*/

function closeOTPwin(){
	 closeWindow();
}

function winOpen(){
	Alloy.Globals.hideLoading();
	Alloy.Globals.currentWindowMain = "winTermsCondition";
	Alloy.Globals.arrWindows.push($.winTermsCondition);
	Ti.API.info(Alloy.Globals.currentWindow+'===window===== leng=='+ Alloy.Globals.arrWindows.length);
	
}
function closeWindow(){
	Alloy.Globals.arrWindows.pop($.winTermsCondition);
	Alloy.Globals.currentWindowMain = "NoWin";
	$.winTermsCondition.close();
	Ti.API.info(Alloy.Globals.currentWindowMain+'window leng'+ Alloy.Globals.arrWindows.length);
}
$.winTermsCondition.addEventListener('android:back', function (e) {
	closeWindow();
});
changeLanguage();