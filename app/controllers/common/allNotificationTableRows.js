
var args = arguments[0] || {};

//Ti.API.info(' ARGS FOR TABLE ROW: '+ JSON.stringify(args));

/*var notificationType = (args.nTypeId=="1"?Alloy.Globals.selectedLanguage.generic:
					   (args.nTypeId=="2"?Alloy.Globals.selectedLanguage.news:
					   (args.nTypeId=="3"?Alloy.Globals.selectedLanguage.events:
					   (args.nTypeId=="4"?Alloy.Globals.selectedLanguage.funeral:Alloy.Globals.selectedLanguage.services))));*/

if (Alloy.Globals.isEnglish) 
{
	$.labelNotificationTitle.left = 0;
	$.labelNotificationTitle.right = 60;
	$.labelNotificationTitle.textAlign = Ti.UI.TEXT_ALIGNMENT_LEFT;
	
	$.labelNofificationTime.right = 0;
	$.labelNofificationTime.left = undefined;
	
	$.labelNotificationDescription.textAlign = Ti.UI.TEXT_ALIGNMENT_LEFT;
}
else
{
	$.labelNotificationTitle.left = 60,
	$.labelNotificationTitle.right = 0,
	$.labelNotificationTitle.textAlign = Ti.UI.TEXT_ALIGNMENT_RIGHT;
	
	$.labelNofificationTime.right = undefined;
	$.labelNofificationTime.left = 0;
	
	$.labelNotificationDescription.textAlign = Ti.UI.TEXT_ALIGNMENT_RIGHT;
}
//$.labelNotificationTitle.text = notificationType;
$.labelNotificationTitle.text = Alloy.Globals.selectedLanguage.services;

$.labelNofificationTime.text = args.date;
$.labelNotificationDescription.text = args.mText;
