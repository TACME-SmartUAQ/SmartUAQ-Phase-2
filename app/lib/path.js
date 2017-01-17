exports.path = function() {

	var resourcePath = '';
	var isIpad = false;
	var isAndroid = false;

	var path;

	if (OS_IOS) {
		resourcePath = Ti.Filesystem.resourcesDirectory + "images/iPhoneImages/";
		resourcePathDrop = Ti.Filesystem.resourcesDirectory + "images/dropbox/";
	} else if (Ti.Platform.osname == 'ipad') {
		resourcePath = Ti.Filesystem.resourcesDirectory + "images/iPadImages/";
		resourcePathDrop = Ti.Filesystem.resourcesDirectory + "images/dropbox/";
	} else if (Ti.Platform.osname == "android") {
		isAndroid = true;
		resourcePath = Ti.Filesystem.resourcesDirectory + "images/iPhoneImages/";
		resourcePathDrop = Ti.Filesystem.resourcesDirectory + "images/dropbox/";
	}

	path = {
		weatherImage : resourcePath + 'weather/',
		// webserviceUrl : "",
		// webserviceUrl :"http://83.111.136.2", // Stging URL for Client to testing and showing DEMO of App.
		// webserviceUrl : "http://94.57.252.237", // Keep this IP for general progreesive build
		//webserviceUrl : "http://94.57.252.244", // Keep this IP for showing "Coming Soon" build
		//webserviceUrl : "http://192.168.1.85:8080", // Raheem's local machine IP for testing push notification if needed'
		grayColor : "#dadadc",
		whiteColor : "white",
		titleRedColor : "#D12C31",
		darkGray : "#9F9F9F", // "#9F9F9F" "#adadad",
		greenColor : "#16dcc2",
		blackColor : "#000",
		darkestGray : "#555555",
		silverColor : "#E8EDF3",
        redColor : "#FF0000",
        yellowPsw : "#D7E639",    
        blueQuestion : "cyan",
        lightRed : "#F8DDDD",
        lightgray : "#EBEBEB",
        lineGray : "##D9D9D9",
        darkBrown : "#010000",
		font44 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 46 : 47) : ((Alloy.Globals.isEnglish) ? 44 : 45)) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font26Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 28 : 29) : ((Alloy.Globals.isEnglish) ? 26 : 27)) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font26 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 28 : 29) : ((Alloy.Globals.isEnglish) ? 26 : 27)) + "sp",
			fontFamily : "Helvetica Regular",
		},
		font25 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 27 : 28) : ((Alloy.Globals.isEnglish) ? 25 : 26)) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font24Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 26 : 27) : ((Alloy.Globals.isEnglish) ? 24 : 25 )) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font24 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 26 : 27) : ((Alloy.Globals.isEnglish) ? 24 : 25 )) + "sp",
			fontFamily : "Helvetica Regular",
		},
		font23 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 25 : 26) : ((Alloy.Globals.isEnglish) ? 23 : 24 )) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font22Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 24 : 25) : ((Alloy.Globals.isEnglish) ? 22 : 23)) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font22 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 24 : 25) : ((Alloy.Globals.isEnglish) ? 22 : 23)) + "sp",
			fontFamily : "Helvetica Regular",
		},
		font21 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 23 : 24) : ((Alloy.Globals.isEnglish) ? 21 : 22)) + "sp",
			fontFamily : "Helvetica Regular",
		},
		font20 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 22 : 23) : ((Alloy.Globals.isEnglish) ? 20 : 21)) + "sp",
			fontFamily : "Helvetica Regular",
		},
		font20Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 22 : 23) : ((Alloy.Globals.isEnglish) ? 20 : 21)) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font19 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 21 : 22) : ((Alloy.Globals.isEnglish) ? 19 : 20 )) + "sp",
			fontFamily : "Helvetica Regular",
		},
		font18Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 20 : 21) : ((Alloy.Globals.isEnglish) ? 18 : 19)) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font18 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 20 : 21) : ((Alloy.Globals.isEnglish) ? 18 : 19 )) + "sp",
			fontFamily : "Helvetica Regular",
		},
		font17Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 19 : 20) : ((Alloy.Globals.isEnglish) ? 17 : 18 )) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font17 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 19 : 20) : ((Alloy.Globals.isEnglish) ? 17 : 18 )) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font16Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 18 : 19) : ((Alloy.Globals.isEnglish) ? 16 : 17)) + "sp",
			fontFamily : "Helvetica Neue",
			fontWeight : "bold"
		},
		font16 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 18 : 19) : ((Alloy.Globals.isEnglish) ? 16 : 17 )) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font15Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 17 : 18) : ((Alloy.Globals.isEnglish) ? 15 : 16)) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font15 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 17 : 18) : ((Alloy.Globals.isEnglish) ? 15 : 16)) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font14Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 16 : 17) : ((Alloy.Globals.isEnglish) ? 14 : 15)) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font14 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 16 : 17) : ((Alloy.Globals.isEnglish) ? 14 : 15)) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font13Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 15 : 16) : ((Alloy.Globals.isEnglish) ? 13 : 14 )) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font13 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 15 : 16) : ((Alloy.Globals.isEnglish) ? 13 : 14)) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font12 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 14 : 15) : ((Alloy.Globals.isEnglish) ? 12 : 13 )) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font12Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 14 : 15) : ((Alloy.Globals.isEnglish) ? 12 : 13 )) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font11Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 13 : 14) : ((Alloy.Globals.isEnglish) ? 11 : 12 )) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font11Tablet : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 13 : 14) : ((Alloy.Globals.isEnglish) ? 11 : 12 )) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font11 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 13 : 14) : ((Alloy.Globals.isEnglish) ? 11 : 12 )) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font10Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 12 : 13) : ((Alloy.Globals.isEnglish) ? 10 : 11 )) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		font10 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 12 : 13) : ((Alloy.Globals.isEnglish) ? 10 : 11)) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font9 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 11 : 12) : ((Alloy.Globals.isEnglish) ? 9 : 10 )) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font8 : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 10 : 11) : ((Alloy.Globals.isEnglish) ? 8 : 9)) + "sp",
			fontFamily : "Helvetica Regular"
		},
		font8Bold : {
			fontSize : ((Alloy.isTablet) ? ((Alloy.Globals.isEnglish) ? 10 : 11) : ((Alloy.Globals.isEnglish) ? 8 : 9 )) + "sp",
			fontFamily : "Helvetica Regular",
			fontWeight : "bold"
		},
		"facebook" : {
			"appId" : "459740920843860",//"577376248981187"
		},
		twitter : {
			"consumerKey" : "HRsWE0OfbyslVO089tsucjd0x",
			"consumerSecret" : "eMfqUnbmrwaLqoUnLjFpgOX9VdyBsb9XSRvN34t0Q8JAVdpLsO",
			"callbackUrl" : "https://api.twitter.com/oauth/access_token"
		},

		bg : resourcePath + "bg.png",
		shareApp: resourcePath + "icnShareApp.png",
		paymentHistory: resourcePath + "icnpayment_history.png",
		homescreenloading_ar:""+"bg_loading_help_Ar.png",
		homescreenloading_en:""+"bg_loading_help_En.png",
		// bg_Janazah : resourcePath + "bg_janazah.png",
		iconHelp: resourcePath+"icnhelp.png",
		iconHelp_ar: resourcePath+"icnhelp_ar.png",
		icnBack : resourcePath + "icnBack.png",
		About : resourcePath + "About.png",
		Contact_Us : resourcePath + "Contact-Us.png",
		Events : resourcePath + "Events.png",
		Feedback : resourcePath + "Feedback.png",
		Funeral : resourcePath + "Funeral.png",
		News : resourcePath + "News.png",
		Services : resourcePath + "Services.png",

		About_Right : resourcePath + "About_Right.png",
		Contact_Us_Right : resourcePath + "Contact-Us_Right.png",
		Events_Right : resourcePath + "Events_Right.png",
		Feedback_Right : resourcePath + "Feedback_Right.png",
		Funeral_Right : resourcePath + "Funeral_Right.png",
		News_Right : resourcePath + "News_Right.png",
		Services_Right : resourcePath + "Services_Right.png",
		bgLogin : resourcePath + "bgLogin.png",
		img : resourcePath + "img.png",
		imgSelected : resourcePath + "imgSelected.png",
		leftMenu : resourcePath + "leftMenu.png",
		leftMenuSelected : resourcePath + "leftMenuSelected.png",
		rightMenu : resourcePath + "rightMenu.png",
		rightMenuSelected : resourcePath + "rightMenuSelected.png",
		leftMenuAr : resourcePath + "leftMenuAr.png",
		leftMenuSelectedAr : resourcePath + "leftMenuSelectedAr.png",
		rightMenuAr : resourcePath + "rightMenuAr.png",
		rightMenuSelectedAr : resourcePath + "rightMenuSelectedAr.png",
		btnGreen : resourcePath + "btnGreen.png",
		btnRed : resourcePath + "btnRed.png",
		icnNavFavourite : resourcePath + "icnNavFavourite.png",
		icnNavHappiness : resourcePath + "icnNavHappiness.png",
		icnNavLeftPanel : resourcePath + "icnNavLeftPanel.png",
		icnNavNotification : resourcePath + "icnNavNotification.png",
		bgLeftPanel : resourcePath + "bgLeftPanel.png",
		bgProfileImage : resourcePath + "bgProfileImage.png",
		icnHome : resourcePath + "icnHome.png",
		icnLanguage : resourcePath + "icnLanguage.png",
		icnMyServices : resourcePath + "icnMyServices.png",
		icnSuggestion : resourcePath + "icnSuggestion.png",
		switchLeft : resourcePath + "switchLeft.png",
		switchRight : resourcePath + "switchRight.png",
		icnServiceHeader : resourcePath + "icnServiceHeader.png",
		icnJnazahHeader : resourcePath + "icnJnazahHeader.png",

		icnUser : resourcePath + "icnUser.png",
		icnPassword : resourcePath + "icnPassword.png",
		icnCalender : resourcePath + "icnCalender.png",
		icnLocation : resourcePath + "icnLocation.png",
		icnCalenderWhite : resourcePath + "icnCalenderWhite.png",
		icnLocationWhite : resourcePath + "icnLocationWhite.png",
		icnFavouriteWhite : resourcePath + "icnFavouriteWhite.png",
		icnShareWhite : resourcePath + "icnShareWhite.png",

		menuAbout : resourcePath + "menuAbout.png",
		menuContactUs : resourcePath + "menuContactUs.png",
		menuEvents : resourcePath + "menuEvents.png",
		menuFeedback : resourcePath + "menuFeedback.png",
		menuJnazah : resourcePath + "menuJnazah.png",
		menuServices : resourcePath + "menuServices.png",
		menuNews : resourcePath + "menuNews.png",
		bottomMenuClose : resourcePath + "bottomMenuClose.png",
		bottomMenuExpand : resourcePath + "bottomMenuExpand.png",

		imgBottomArrow : resourcePath + "imgBottomArrow.png",
		imgTabSeperator : resourcePath + "imgTabSeperator.png",
		icnCallGray : resourcePath + "icnCallGray.png",
		icnFacebookGray : resourcePath + "icnFacebookGray.png",
		icnFaxGray : resourcePath + "icnFaxGray.png",
		icnMailGray : resourcePath + "icnMailGray.png",
		icnTwitterGray : resourcePath + "icnTwitterGray.png",
		icnWebGray : resourcePath + "icnWebGray.png",
		icnCallRed : resourcePath + "icnCallRed.png",
		icnFacebookRed : resourcePath + "icnFacebookRed.png",
		icnFaxRed : resourcePath + "icnFaxRed.png",
		icnMailRed : resourcePath + "icnMailRed.png",
		icnTwitterRed : resourcePath + "icnTwitterRed.png",
		icnWebRed : resourcePath + "icnWebRed.png",
		imgDepartmentLogo : resourcePath + "imgDepartmentLogo.png",
		imgUAQLogo : resourcePath + "imgUAQLogo.png",
		
		icnMailWhite : resourcePath + "icnMailWhite.png",
		icnCallWhite : resourcePath + "icnCallWhite.png",
		icnFaxWhite : resourcePath + "icnFaxWhite.png",
		
	
		imgDelete : resourcePath + "imgDelete.png",
		imgNormalRow : resourcePath + "imgNormalRow.png",
		imgSelectedRow : resourcePath + "imgSelectedRow.png",

		bgNotification : resourcePath + "bgNotification.png",
		bgHappiness : resourcePath + "bgHappiness.png",
		imgAverage : resourcePath + "imgAverage.png",
		imgHappy : resourcePath + "imgHappy.png",
		imgSad : resourcePath + "imgSad.png",
		btnGray : resourcePath + "btnGray.png",
		icnAdd : resourcePath + "icnAdd.png",
		icnDropDown : resourcePath + "icnDropDown.png",
		icnDownArrow : resourcePath + "icnDownArrow.png",
		icnAttachpin : resourcePath + "iconAttachment.png",
		icnQuestionBlack :  resourcePath + "icnQuestion.png",
		icnFavouriteRed : resourcePath + "icnFavouriteRed.png",
		icnShareRed : resourcePath + "icnShareRed.png",
		icnFavourite : resourcePath + "fav-red.png",
		icnFavouriteWhiteFill : resourcePath + "icnNavFavourite.png",
		icnClose : resourcePath + "icnclose.png",
		
		//### homescreen image path by ravindra### //
		icnAbout : resourcePath + "imgAbout.png",
		icnAboutSelected : resourcePath + "imgAboutSelected.png",
		icnContact : resourcePath + "imgContact.png",
		icnContactSelected : resourcePath + "imgContactSelected.png",
		icnEvent : resourcePath + "imgEvents.png",
		icnEventsSelected : resourcePath + "imgEventsSelected.png",
		icnFeedback : resourcePath + "imgFeedback.png",
		icnFeedbackSelected : resourcePath + "imgFeedbackSelected.png",
		icnJnazah : resourcePath + "imgJnazah.png",
		icnJnazahSelected : resourcePath + "imgJnazahSelected.png",
		icnNews : resourcePath + "imgNews.png",
		icnNewsSelected : resourcePath + "imgNewsSelected.png",
		icnService : resourcePath + "imgService.png",
		icnServiceSelected : resourcePath + "imgServiceSelected.png",
		icnActiveArrow : resourcePath + "imgActiveArrow.png",
		icnActiveArrowLeft : resourcePath + "imgActiveArrowLeft.png",
		
		//### bruno image path### //
		checkInactive : resourcePath + 'chqbox.png',
		checkActive : resourcePath + 'chqboxactive.png',
		emiratesId1 : resourcePath + 'emirateId1.png',
		emiratesId2 : resourcePath + 'emirateId2.png',
		emiratesId3 : resourcePath + 'emirateId3.png',
		emiratesId4 : resourcePath + 'emirateId4.png',
		emiratesId5 : resourcePath + 'emirateId5.png',
		bgProfileImagePath : resourcePath + "profileIMG.png",
		//### dropbox iamge ###// 
		dropboxFolderImg : resourcePathDrop + 'foldericon.png',
		
		weatherICOns : resourcePath,
		weatherICONOCHNG : resourcePath+'WeatherEn/60x60/na.png',
		// ### end of image path ## //
		radioActive : resourcePath + 'radio-btn-act.png',
		radioInactive : resourcePath + 'radio-btn.png'
	};

	return path;
};
