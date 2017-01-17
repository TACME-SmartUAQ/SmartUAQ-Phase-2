//Require File......
var httpManager = require("httpManager");
// Activity indicator: use : While loading the help screens
var actHelp = Ti.UI.createActivityIndicator({
	color: 'white',
	font: {fontFamily:'Helvetica Neue', fontSize:15, fontWeight:'bold'},
	message: Alloy.Globals.selectedLanguage.helpscreensloading,
	style: 3,
	height:Ti.UI.SIZE,
	bottom:"20dp",
	left:'5dp',
	zIndex:465,
	width:Ti.UI.SIZE
});
$.winHelp.add(actHelp);
// Change Language function....
var preLang = null;
function changeLanguage() {
	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;
	$.lblNavTitle.text = Alloy.Globals.selectedLanguage.help;
	
	$.viewLeftPanel.setLanguage();
	$.viewHappinessIndicator.changeLanguage();
	$.viewNotification.changeLanguage();
	createViewas_Bind();
}
// WIN open function/event
function winOpen(){
	Alloy.Globals.arrWindows.push($.winHelp);
	$.viewNavigationTools.getView().win = $.mainView;
	$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
	$.viewNavigationTools.setNotificationView($.viewNotification.getView());
	$.viewLeftPanel.getView().changeLanguage = changeLanguage;
	$.viewNavigationTools.getView().transparentView = $.viewTransparent;
	changeLanguage();
}
//Close left panel
function closeLeftPanel(){
	$.viewNavigationTools.onMenu();
}
//Window FOCUS event/function
function winFocus(e){
	Alloy.Globals.bottomMenu = $.backView;
	// $.viewBottomMenu.addInnerMenu();
	Ti.API.info('CURR. WINNNN : '+ e.source.id);
	Alloy.Globals.currentWindow = "winHelp";
	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : undefined
	});
	// show push notification panel based upon user is logged in or not?
	// Alloy.Globals.manageEservicesNotification();
}
//Window close function/Event
function closeWindow(){
	Alloy.Globals.arrWindows.pop($.winHelp);
	$.winHelp.close();
}
/// Bind the Helpscreen views in Scrollableview
var createViewas_Bind = function(){
	Ti.API.info('TOTAL SCREENS : '+Alloy.Globals.HELPSCREEN_COUNT);
	if (Alloy.Globals.HELPSCREEN_COUNT>0)
	{
		var helpScreenViews = [];
		for (var i=0; i<Alloy.Globals.HELPSCREEN_COUNT; i++){
			// var viewMainContainer = Ti.UI.createView({
				// height:"100%",
				// width:"100%",
				// backgroundColor:"white"
			// });
			var imgHelp = Ti.UI.createImageView({
				height:"100%",
				width:"100%",
				defaultImage:Alloy.Globals.path.bg,
				image:Alloy.Globals.sitesUrl + "/img/mhelp/help_"+ (Alloy.Globals.isEnglish?"en/":"ar/") + parseInt(i+1) +".png"
				// image:getAppHelpscreenImagesFromFileSys(Alloy.Globals.isEnglish?"en_helpscreens":"ar_helpscreens", parseInt(i+1) +".png")
			});
			imgHelp.addEventListener("load",function(){
				actHelp.hide();
			});
			// viewMainContainer.add(imgHelp);
			//Ti.API.info('IMAGE '+parseInt(i+1)+" "+imgHelp.image);
			helpScreenViews.push(imgHelp);
		}
		$.scrllableviewHelpScreen.setViews(helpScreenViews);
		$.lblFinishRight5.text = Alloy.Globals.selectedLanguage.next;
		$.scrllableviewHelpScreen.animate({opacity:1, duration:1000},function(){
			$.scrllableviewHelpScreen.scrollToView(0);
			$.lblFinishRight5.animate({opacity:1, duration:2000});
		});
	}
};

/*var getAppHelpscreenImagesFromFileSys = function(langCode, imgName){
	//var getFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+ "en_helpscreens");
	//Ti.API.info('file got path: '+getFile.nativePath);
	//Ti.API.info('file got path:11111 '+getFile.getDirectoryListing());
	//ary.push(getFile.getDirectoryListing());
	//Ti.API.info('list11: '+ ary);
	var getFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+ langCode, imgName);
		//imgPaths.push(getFile.nativePath);
		Ti.API.info('final and fulll path : '+getFile.nativePath);
	return getFile.nativePath;
};*/
//// close helpscreen window base on last page (End) label
var _eventCloseHelpScreen = function(){
	if ($.lblFinishRight5.text == Alloy.Globals.selectedLanguage.end)
	{
		closeWindow();
	}
	else{
		$.scrllableviewHelpScreen.scrollToView(currentPage+1);
	}
};
//managing scroll event of scrollableview
var currentPage = 0;
var _eventScrollableViewScroll = function(e){
	Ti.API.info('CURENT PAGE is : '+ e.currentPage);
	currentPage = e.currentPage;
	if (currentPage==Alloy.Globals.HELPSCREEN_COUNT-1){
		$.lblFinishRight5.text = Alloy.Globals.selectedLanguage.end;
	}
	else
	{
		$.lblFinishRight5.text = Alloy.Globals.selectedLanguage.next;
	}
};
//Height of Scrollableview
var _eventWinPostLayout = function(){
	$.viewScrollableViewContainer.height = Ti.Platform.displayCaps.platformHeight - $.navBarBackView.toImage().height;
};
actHelp.show();