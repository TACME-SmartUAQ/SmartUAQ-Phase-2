var utilities = require("utilities");

Ti.API.info('VIEW DEPARTMENT LIST');
var departmentList = null;

var arrSection = [];

function loadDepartment(arr, source) {
	// if(source == "web"){
	  // arr.shift();	
	// }
	departmentList = arr;
	var lstSection = Ti.UI.createListSection();
	var arrData = [];
	for (var i = 0; i < arr.length; i++) {
		var imageObject = null;
		if(arr[i].departmentNameEN != "Umm-Al-Quwain"){
			
		
		if (arr[i].images) {
			imageObject = Alloy.Globals.webserviceUrl.replace("https", "http") + JSON.parse(JSON.stringify(arr[i].images)).teaserImage;
		} else {
			imageObject = Alloy.Globals.path.imgDepartmentLogo;
		}

		arrData.push({
			imageviewDepartment : {
				right : (Alloy.Globals.isEnglish) ? undefined : 0,
				left : (Alloy.Globals.isEnglish) ? 0 : undefined,
				image : imageObject,
			},

			viewDepartmentDetail : {
				left : (Alloy.Globals.isEnglish) ? 110 : 20,
				right : (Alloy.Globals.isEnglish) ? 20 : 110,
			},

			labelTitle : {
				text : (Alloy.Globals.isEnglish) ? arr[i].departmentNameEN.toUpperCase() : arr[i].departmentNameAR,
				textAlign : (Alloy.Globals.isEnglish) ? Titanium.UI.TEXT_ALIGNMENT_LEFT : Titanium.UI.TEXT_ALIGNMENT_RIGHT,
				font : Alloy.Globals.path.font14Bold,
			},

			labelDescription : {
				text : arr[i].teaserText,
				textAlign : (Alloy.Globals.isEnglish) ? Titanium.UI.TEXT_ALIGNMENT_LEFT : Titanium.UI.TEXT_ALIGNMENT_RIGHT
			},

			imageviewCall : {
				height : (arr[i].telephoneNumber) ? 20 : 0,
				width : (arr[i].telephoneNumber) ? 20 : 0,
				left : 0,
			},

			imageviewFax : {
				height : (arr[i].fax) ? 20 : 0,
				width : (arr[i].fax) ? 20 : 0
			},

			imageviewMail : {
				height : (arr[i].emailID) ? 20 : 0,
				width : (arr[i].emailID) ? 20 : 0,
			},

			imageviewWeb : {
				height : (arr[i].website) ? 20 : 0,
				width : (arr[i].website) ? 20 : 0,
			},

			imageviewFacebook : {
				height : (arr[i].facebookContact) ? 20 : 0,
				width : (arr[i].facebookContact) ? 20 : 0,
			},

			imageviewTwitter : {
				height : (arr[i].twitterContact) ? 20 : 0,
				width : (arr[i].twitterContact) ? 20 : 0,
			},

			viewButtons : {
				left : (Alloy.Globals.isEnglish) ? 0 : undefined,
				right : (Alloy.Globals.isEnglish) ? undefined : 0
			},

			properties : {
				doc : arr[i],
				backgroundColor : 'transparent'
			}
		});
		
		} // if loop close condition

	}

	lstSection.setItems(arrData);
	//$.listviewDepartment.appendSection(lstSection);
	$.listviewDepartment.sections[0].setItems(arrData);
}

/*function loadDepartment(arr) {
 var arrSection = [];
 for (var j = 0; j < 2; j++) {
 var lstSection = Ti.UI.createListSection();
 var headerView = Ti.UI.createView({
 height : 60,
 width : "100%",
 backgroundColor : "transparent",
 //listSection : lstSection,
 isExpanded : false,
 });
 lstSection.headerView = headerView;

 var arrData = [];
 for (var i = 0,
 len = 5; i < len; i++) {
 arrData.push({
 labelTitle : {
 text : ((i % 2 == 0) ? "Department" : ("Department Department Department Department Department Department " + i))
 },
 labelDescription : {
 text : "Description Description Description",
 },
 properties : {
 doc : arr[i],
 backgroundColor : 'transparent'
 }
 });
 }
 lstSection.setItems(arrData);
 //arrSection.push(lstSection);
 $.listviewDepartment.appendSection(lstSection);
 }
 //$.listviewDepartment.sections[0].setItems(arrData);
 }*/

exports.loadDepartment = loadDepartment;

function onItemClick(e) {
	utilities.disableMultiTouch(e.source);
	
	var section = $.listviewDepartment.sections[e.sectionIndex];
	Ti.API.info('section index'+ e.itemIndex);
	//var itemIndexCnt = e.itemIndex+1;
	var item = section.getItemAt(e.itemIndex);
    //Ti.API.info('section index'+ JSON.stringify(item.properties.doc));
    //Ti.API.info('section index22'+ JSON.stringify(departmentList[e.itemIndex]));
	// Alloy.Globals.openWindow(Alloy.createController("Department/winDepartmentDetail", departmentList[e.itemIndex]).getView());
	Alloy.Globals.openWindow(Alloy.createController("Department/winDepartmentDetail", item.properties.doc).getView());

}

//loadDepartment([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
