var httpManager = require("httpManager");
var utilities = require("utilities");
var dbManager = require("dbUtility");

exports.changeLanguage = function changeLanguage() {
	$.labelTitle.text = Alloy.Globals.selectedLanguage.happinessTitle;
	if (Alloy.Globals.isEnglish) {
		$.labelTitle.textAlign = Titanium.UI.TEXT_ALIGNMENT_LEFT;
	} else {
		$.labelTitle.textAlign = Titanium.UI.TEXT_ALIGNMENT_RIGHT;
	}
};

function closeView(e) {
	if(e.source.id != "viewHappinessMain"){
		return;
	}
	if ($.viewHappinessMain.visible) {
		$.viewHappinessMain.animate({
			opacity : 0,
			duration : 300
		}, function(e) {
			$.viewHappinessMain.visible = false;
		});
	} else {
		$.viewHappinessMain.visible = true;
		$.viewHappinessMain.animate({
			opacity : 1,
			duration : 300
		});
	}
}

function submitRating(e){
	try{
		
		
		if (Ti.Network.online == false) {
			Ti.App.fireEvent("showInternetToast");
			return;	
		}
		var rating = e.source.rateId;		
		httpManager.submitRating(rating,function(response){
			if(response == null)
			  return;
			if(response.status == 1){
				dbManager.insertHappyData(response.status);				
				var dialog = Ti.UI.createAlertDialog({
					ok : 0,
					title : Alloy.Globals.selectedLanguage.appTitle,
					message : Alloy.Globals.selectedLanguage.submitRating,
					buttonNames : [Alloy.Globals.selectedLanguage.ok]
				});
				
				dialog.addEventListener('click',function(e){
					if (e.index === e.source.ok){
						$.viewHappinessMain.visible = false;
					}
				});
				
				dialog.show();
			}
		});
	}catch(e){
		Ti.API.info('Error '+e.message);
	}
}
