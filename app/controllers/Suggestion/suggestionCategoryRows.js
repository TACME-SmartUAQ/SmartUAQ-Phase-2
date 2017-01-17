var args = arguments[0] || {};
// Ti.API.info('ARGS: '+JSON.stringify(args));
var isEnglish = Alloy.Globals.isEnglish;
(isEnglish?$.labelSuggestion.textAlign=Titanium.UI.TEXT_ALIGNMENT_LEFT:$.labelSuggestion.textAlign=Titanium.UI.TEXT_ALIGNMENT_RIGHT);
$.labelSuggestion.text = (isEnglish?args.categoryName_en:args.categoryName_ar);

$.tblRow.categoryName_En = args.categoryName_en;
$.tblRow.categoryName_Ar = args.categoryName_ar;
$.tblRow.categoryId = args.categoryId;
