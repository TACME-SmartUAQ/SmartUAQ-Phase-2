var args = arguments[0] || {};

function selectEnglish() {
	Alloy.Globals.changeLanguage("english");
	Alloy.Globals.openWindow(Alloy.createController('UserManagement/winLogin',{
			isFromLeftPanel : false
		}).getView());
}

function selectArabic() {
	Alloy.Globals.changeLanguage("arabic");
	Alloy.Globals.openWindow(Alloy.createController('UserManagement/winLogin',{
			isFromLeftPanel : false
		}).getView());
}

