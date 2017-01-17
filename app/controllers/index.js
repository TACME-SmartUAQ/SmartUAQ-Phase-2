function openMenuSelectionWindow() {

}

function openLanguageWindow() {
	
	if (Ti.App.Properties.getBool("isLanguageSelected")) 
	{
		Alloy.Globals.isEnglish = Ti.App.Properties.getBool("isEnglishSelected");
		if (Alloy.Globals.isEnglish) {
			Alloy.Globals.changeLanguage("english");
		} else {
			Alloy.Globals.changeLanguage("arabic");
		}

		var winMenu = Alloy.createController('UserManagement/winLogin',{
			isFromLeftPanel : false
		}).getView();
		

		if (OS_IOS) {
			$.tab1.window = winMenu;
			Alloy.Globals.tab = $.tab1;
			Alloy.Globals.SetMainWindow($.tabGroup);
			$.tabGroup.open();
		} else {
			Alloy.Globals.openWindow(winMenu);
			Alloy.Globals.SetMainWindow(winMenu);

		}
	} else {

		var winLanguage = Alloy.createController('common/winLanguage').getView();

		if (OS_IOS) {
			$.tab1.window = winLanguage;
			Alloy.Globals.tab = $.tab1;
			Alloy.Globals.SetMainWindow($.tabGroup);
			$.tabGroup.open();

		} else {
			Alloy.Globals.openWindow(winLanguage);
			Alloy.Globals.SetMainWindow(winLanguage);

		}
	}

};

openLanguageWindow();
