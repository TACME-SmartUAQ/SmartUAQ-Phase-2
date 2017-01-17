var arrList = arguments[0].data;
var title = arguments[0].title;
var callBackFunction = arguments[0].callBackFunction;
var lbl = arguments[0].lbl;
var type = arguments[0].type;

var preLang = null;

var isEnglish = Alloy.Globals.isEnglish;

if (Alloy.Globals.isIOS7Plus) {
	$.statusBar.height = 20;
	//$.statusBar.backgroundColor = Alloy.Globals.path.bgColor;
}

var changeLanguage = function() {

	if (preLang == Alloy.Globals.language) {
		return;
	}
	preLang = Alloy.Globals.language;

	$.lblNavTitle.text = title;

	loadSelection();
};

$.tblSelection.addEventListener("click", function(e) {
	// $.winSelection.fireEvent('select', arrList[e.index]);
	var selectData = {
		label : lbl,
		labelTitle : e.source.rowTitle.text,
		selectedIndex : e.index,
		obj : arrList[e.index]
	};
	callBackFunction(selectData);
	$.winSelection.close();
});

var loadSelection = function() {

	var rowData = [];

	var selected = false;

	for (var i = 0; i < arrList.length; i++) {

		var lblTitle = Ti.UI.createLabel({
			font : (Alloy.isTablet) ? Alloy.Globals.path.font17 : Alloy.Globals.path.font14,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			touchEnabled : false,
			color : 'black',
			text : (isEnglish) ? arrList[i].title : arrList[i].titleAr
		});
		if (isEnglish) {
			lblTitle.textAlign = Ti.UI.TEXT_ALIGNMENT_LEFT;
			lblTitle.left = '10dp';

		} else {
			lblTitle.textAlign = Ti.UI.TEXT_ALIGNMENT_RIGHT;
			lblTitle.right = '10dp';
		}
		var row = Ti.UI.createTableViewRow({
			height : '45dp',
			rowTitle : lblTitle,
			obj : arrList[i]
		});
		row.add(lblTitle);

		var separetorView = Ti.UI.createView({
			left : 0,
			right : 0,
			bottom : 0,
			height : 1,
			touchEnabled : false,
			backgroundColor : Alloy.Globals.path.grayColor
		});

		row.add(separetorView);
		rowData.push(row);
	}

	$.tblSelection.data = rowData;

};
var closeWindow = function(e) {
	$.winSelection.close();
};

$.winSelection.addEventListener("open", function(e) {
	//Alloy.Globals.hideLoading();
});

changeLanguage();
