
var utilities = require("utilities");
var httpManager = require("httpManager");
var args = arguments[0] || {};
var totalPages = null;
var currentPage = null;
var numberOfRecords = null;
var isMoreRow = null;
var itemCount = null;

/*if (args.idToExpand)
	args = args.response;
else
	args = args;
*/

	
Ti.API.info(' ARGS: '+ JSON.stringify(args));


var preLang = null;

function changeLanguage() {
	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;

	$.viewLeftPanel.setLanguage();

	$.viewHappinessIndicator.changeLanguage();
	$.viewNotification.changeLanguage();

	$.lblNavTitle.text = Alloy.Globals.selectedLanguage.uaqJnazah;
	$.headerLabel.text = Alloy.Globals.selectedLanguage.uaqJnazah;

	if (Alloy.Globals.isEnglish) {
		alignment = Titanium.UI.TEXT_ALIGNMENT_LEFT;
	} else {
		alignment = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
	}
	currentPage = 1;
	itemCount = 0;
	isMoreRow = true;
	numberOfRecords = 5;
	$.viewJnazahList.removeData();
	$.viewJnazahList.listviewServices.sections = [];
	getResponseData();
}


function getResponseData() {
	if (Ti.Network.online==false){
		Alloy.Globals.showInternetMsg($.winJnazahLanding);
		return;
	}
	httpManager.getFuneralDetails(function(response) {
		if (response == null)
			return;
			
		if (response.count > 0) {
			currentPage++;
			totalPages = Math.ceil((response.count / numberOfRecords));
			if (Object.prototype.toString.call(response.funerals) == "[object Array]") {
				$.viewJnazahList.loadServices(response.funerals, " ",currentPage,totalPages);
			} else {
				$.viewJnazahList.loadServices([response.funerals], " ",currentPage,totalPages);
			}
		}

	}, currentPage, numberOfRecords);
}


function winOpen(e) {  
	Alloy.Globals.arrWindows.push($.winJnazahLanding);
	
	$.viewNavigationTools.getView().win = $.mainView;
	$.viewNavigationTools.setHappinessView($.viewHappinessIndicator.getView());
	$.viewNavigationTools.setNotificationView($.viewNotification.getView());
	
	$.viewLeftPanel.getView().changeLanguage = changeLanguage;
	$.viewNavigationTools.getView().transparentView = $.viewTransparent;
	// setTimeout(function(){
		// $.viewJnazahList.loadServices(args.response, (args.idToExpand?args.idToExpand:"")); //1437027878802,1437027879901,1437027879925	
	// },1000);
}


function closeLeftPanel(){
	$.viewNavigationTools.onMenu();
}

function winFocus(e) {
	// Alloy.Globals.manageEservicesNotification();
	Alloy.Globals.bottomMenu = $.backView;
	$.viewBottomMenu.addInnerMenu();
	Alloy.Globals.currentWindow = e.source.id;
	changeLanguage();
	$.viewLeftPanel.setMenuDirectionView({
		direction : Alloy.Globals.SelectedMenuDirection,
		menuCallback : undefined
	});
}

function closeWindow() {
	if(args.isFromMenu){
		Alloy.Globals.gotoHome();
		return;
	  }
	Alloy.Globals.arrWindows.pop($.winJnazahLanding);
	$.winJnazahLanding.close();
}

setTimeout(function(){
	Alloy.Globals.markPublicNotificationAsRead("4");
},2000);
