var args = arguments[0] || {};

function selectEnglish() {
	Alloy.Globals.changeLanguage("english");
}

function selectArabic() {
	Alloy.Globals.changeLanguage("arabic");
}

var selectedMenuType;
Ti.API.info('menu direction ' + Ti.App.Properties.getString("isMenuDirection"));
function selectLeftMenu() {

	$.leftInnerMenu.backgroundImage = (Alloy.Globals.isEnglish) ? Alloy.Globals.path.leftMenuSelected : Alloy.Globals.path.leftMenuSelectedAr;
	$.rightInnerMenu.backgroundImage = (Alloy.Globals.isEnglish) ? Alloy.Globals.path.rightMenu : Alloy.Globals.path.rightMenuAr;

	$.leftOuterMenu.opacity = 1;
	$.leftInnerMenu.backgroundColor = "transparent";
	$.rightOuterMenu.opacity = 0.5;
	$.rightInnerMenu.backgroundColor = "black";
	selectedMenuType = "left";
	Ti.App.Properties.setString("isMenuDirection", selectedMenuType);
}

selectLeftMenu();

function selectRightMenu() {
	$.leftInnerMenu.backgroundImage = (Alloy.Globals.isEnglish) ? Alloy.Globals.path.leftMenu : Alloy.Globals.path.leftMenuAr;
	$.rightInnerMenu.backgroundImage = (Alloy.Globals.isEnglish) ? Alloy.Globals.path.rightMenuSelected : Alloy.Globals.path.rightMenuSelectedAr;
	$.leftOuterMenu.opacity = 0.5;
	$.leftInnerMenu.backgroundColor = "black";
	$.rightOuterMenu.opacity = 1;
	$.rightInnerMenu.backgroundColor = "transparent";
	selectedMenuType = "right";
	Ti.App.Properties.setString("isMenuDirection", selectedMenuType);
}

function openHomeWindow() {

	Alloy.Globals.openWindow(Alloy.createController('winHome',selectedMenuType).getView());

}

