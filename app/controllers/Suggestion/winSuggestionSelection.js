var arrList = arguments[0].data;
var title = arguments[0].title;
var callBackFunction = arguments[0].callBackFunction;
// var lbl = arguments[0].lbl;
// var type = arguments[0].type;
var preLang = null;

var isEnglish = Alloy.Globals.isEnglish;

if (Alloy.Globals.isIOS7Plus) {
	$.statusBar.height = 20;
}

var changeLanguage = function() {

	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;

	$.lblNavTitle.text = title;

	// loadSelection();
};

$.tblSuggestionList.addEventListener("click", function(e) {
	var selectData = {
		categoryName_En : e.row.categoryName_En,
		categoryName_Ar : e.row.categoryName_Ar,
		categoryId : e.row.categoryId
	};
	callBackFunction(selectData);
	$.winSuggestionSelection.close();
});
var rowData = [];
var loadSelection = function() {
	rowData = [];
	for (var i = 0; i < arrList.length; i++){
		rowData.push(Alloy.createController('Suggestion/suggestionCategoryRows', arrList[i]).getView());
	}
	$.tblSuggestionList.setData(rowData);
};
var closeWindow = function(e) {
	$.winSuggestionSelection.close();
};

$.winSuggestionSelection.addEventListener("open", function(e) {
	Alloy.Globals.hideLoading();
	loadSelection();
});

changeLanguage();
