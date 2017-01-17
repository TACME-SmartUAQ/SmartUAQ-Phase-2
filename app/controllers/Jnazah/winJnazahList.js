var utilities = require("utilities");

var isMoreRow = false;
var selectedIndex;
Ti.API.info('VIEW DEPARTMENT LIST');
var arrSection = [];
var numberOfRecords = 5;
var currentListPage = null;
var totalListPages = null;
var count = 0;

var funeralDetails = [];

function loadServices(arr,idtoMatch,currentPage,totalPages) {
	currentListPage = currentPage;
	totalListPages = totalPages;
	if(isMoreRow)
	{
		arrSection.pop(arrSection.length-1);
	}
	for (var j = 0; j < arr.length; j++) {

		var lstSection = Ti.UI.createListSection();
		arrSection.push(lstSection);
		var headerView = Ti.UI.createView({
			height : 65,
			width : "100%",
			backgroundColor : "transparent",
			//lSection : lstSection,
			isExpanded : false,
			tiemIndex : j,
			lIndex : count,
		});
		lstSection.headerView = headerView;

		var view = Ti.UI.createView({
			height : 55,
			width : "100%",
			top : 0,
			//lSection : lstSection,
			isExpanded : false,
			backgroundImage : Alloy.Globals.path.imgNormalRow,
			lIndex : count,
			tiemIndex : j,
			layout : "vertical",
		});
		headerView.add(view);

		var labelSectionTitle = Ti.UI.createLabel({
			backgroundColor : "transparent",
			height : 25,
			touchEnabled : false,
			color : Alloy.Globals.path.whiteColor,
			font : Alloy.Globals.path.font15Bold,
			text : arr[j].deceasedName,
			textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
			top : 3,
			width : "100%"
		});
		view.add(labelSectionTitle);
		
		
		var dateView = Ti.UI.createView({
			top : 3,
			height : 30,
			width : Titanium.UI.SIZE,
			bottom : 0,
			touchEnabled : false,
			backgroundColor : "transparent",
			layout : "horizontal",
		});
		
		var dateImage = Ti.UI.createImageView({
			height : 15,
			width : 15,
			touchEnabled : false,
			backgroundColor : "transparent",
			image : Alloy.Globals.path.icnCalenderWhite,
		});
		
		var labelDate = Ti.UI.createLabel({
			backgroundColor : "transparent",
			height : Titanium.UI.SIZE,
			width : Titanium.UI.SIZE,
			touchEnabled : false,
			color : Alloy.Globals.path.whiteColor,
			font : Alloy.Globals.path.font12,
			text : arr[j].funeralDate,
			left :2 
		});
		
		var labelPrayerTime = Ti.UI.createLabel({
			backgroundColor : "transparent",
			height : Titanium.UI.SIZE,
			width : Titanium.UI.SIZE,
			left:6,
			right:6,
			touchEnabled : false,
			color : Alloy.Globals.path.whiteColor,
			font : Alloy.Globals.path.font12,
			text : arr[j].prayerTime,
		});
		
		
		if (Alloy.Globals.isEnglish) {
		   dateView.add(dateImage);
		   dateView.add(labelDate);
		   dateView.add(labelPrayerTime);
		} else {
		   dateView.add(labelPrayerTime);
		   dateView.add(labelDate);
		   dateView.add(dateImage); 
		   
		}
		view.add(dateView);
		
		 
		if (arr.length == j + 1) {
			var moreSection = Ti.UI.createListSection();
			var moreheaderView = Ti.UI.createView({
				height : 60,
				width : "100%",
				backgroundColor : "transparent",
			});
			moreSection.headerView = moreheaderView;

			var moreView = Ti.UI.createView({
				height : 60,
				width : "100%",
				backgroundColor : "transparent",
			});

			moreheaderView.add(moreView);

			var moreLabel = Ti.UI.createLabel({
				left : 30,
				right : 30,
				color : Alloy.Globals.path.whiteColor,
				font : Alloy.Globals.path.font14,
				text : "View More",
				textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
			});
			moreView.add(moreLabel);

			moreView.addEventListener("click", function(e) {
				getResponseData();
			});

			if (currentPage <= totalPages) {
				isMoreRow = true;
				arrSection.push(moreSection);
			} else {
				isMoreRow = false;
			}
		}

		view.addEventListener("click", function(e) {
		   var location = arr[e.source.tiemIndex].locations;
		   var funeralDate = arr[e.source.tiemIndex].funeralDate;
		   var prayerTime = arr[e.source.tiemIndex].prayerTime;
		   var deceasedName = arr[e.source.tiemIndex].deceasedName;
		   var motherName = arr[e.source.tiemIndex].motherName;
		   var fatherName = arr[e.source.tiemIndex].fatherName;
		   var place = arr[e.source.tiemIndex].place;
		   var symmetry = arr[e.source.tiemIndex].cemetry;
		   var description = arr[e.source.tiemIndex].description;
		   
		   var funeralDetails = [];	
		   funeralDetails.push(Alloy.Globals.selectedLanguage.reminder);
		 /*  
		   if(funeralDate)
		  // funeralDetails.push(funeralDate);
		   
		   if(prayerTime)
		  // funeralDetails.push(prayerTime);
		   
		   if(deceasedName)
		 //  funeralDetails.push(deceasedName);
		   
		   if(motherName)
		  // funeralDetails.push(motherName);
		   
		   if(fatherName)
		  // funeralDetails.push(fatherName);
		   
		   if(place)
		 //  funeralDetails.push(place);
		   
		   if(symmetry)
		 //  funeralDetails.push(symmetry);
		   
		 

			if (description) {
				if (OS_IOS) {
					if (Alloy.Globals.isEnglish) {
					 description = "<html></head><body text=\"black\" bgcolor=\"transparent\" ALIGN=\"left\">" + description + "</body></html>";
					} else {
					 description = "<html></head><body text=\"black\" bgcolor=\"transparent\" ALIGN=\"right\">" + description + "</body></html>";	
					}
				} else if (OS_ANDROID) {
					if (Alloy.Globals.isEnglish) {
					  description = "<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'><html><head></head><body text=\"black\"bgcolor=\"transparent\" ALIGN=\"left\">" + description + "</body></html>";
				    } else {
				      description = "<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'><html><head></head><body text=\"black\"bgcolor=\"transparent\" ALIGN=\"right\">" + description + "</body></html>";
				    }	
				}
			}
*/		
									
		   funeralDetails.push(utilities.cleanFuneralHtml(description));
		   
			if (e.source.isExpanded) {
				arrSection[e.source.lIndex].setItems([]);
				e.source.backgroundImage = Alloy.Globals.path.imgNormalRow;
			} else {
				if(selectedIndex)
				{
					arrSection[selectedIndex.lIndex].setItems([]);
					selectedIndex.backgroundImage = Alloy.Globals.path.imgNormalRow;
				    selectedIndex.isExpanded = false; 
				}
				selectedIndex = e.source;
				var arrData = [];
				for (var i = 0,len = funeralDetails.length; i < len; i++) {

					if (i == 0) {
						arrData.push({
							template : "funeralHeaderView",
							titleLabel : {
								text : funeralDetails[i],
								textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER ,
								width : 100,
								font : Alloy.Globals.path.font15,
							},
							properties : {
								doc : funeralDetails[i],
								backgroundColor : 'transparent'
							}
						});
					} else {
					
						Ti.API.info('desc count ==== ====' + description.length);
						//var heighttxt = parseInt(description.length / 32);
						arrData.push({
							template : "funeralWebview",
							funTextArea : {
								value : utilities.cleanFuneralHtml(description),
								backgroundColor : 'transparent',
								horizontalWrap:true,
                                disableBounce:true,
                                left : (Alloy.Globals.isEnglish) ? 15 : 0,
								right : (Alloy.Globals.isEnglish) ? 0 : 20,
								height :  Titanium.UI.SIZE,
								font : Alloy.Globals.path.font14,
								editable : "false",
	                            scrollable: "false",
	                            autoLink:Titanium.UI.AUTOLINK_URLS,
	                            textAlign : (Alloy.Globals.isEnglish) ? Titanium.UI.TEXT_ALIGNMENT_LEFT : Titanium.UI.TEXT_ALIGNMENT_RIGHT,
	                            color : "black",
	                            tintColor: "blue"
								//heght : 50
							},
							properties : {
								doc : funeralDetails[i],
								height : Titanium.UI.SIZE,
								backgroundColor : 'transparent'
							}
						});
					}
				}
				arrData.push({
							labelFuneralTitle : {
								backgroundColor : 'transparent'
							},
							properties : {
								backgroundColor : 'transparent'
							}
					});
				
				e.source.backgroundImage = Alloy.Globals.path.imgSelectedRow;
				arrSection[e.source.lIndex].setItems(arrData);
			}
			e.source.isExpanded = !e.source.isExpanded;
		});

		// if (idtoMatch){
			// if (idtoMatch==arr.funerals[j].id){
				// view.fireEvent('click');
			// }
	    // }
	   count++;
	}

	 $.listviewServices.sections = arrSection;
	// $.listviewDepartment.sections[0].setItems(arrData);
}

exports.loadServices = loadServices;


function webviewLoad(){
	Ti.API.info('web view load==============');
	//var heght = $.funWebView.evalJS("document.height;");
	//alert(heght);  
}

function getResponseData() {
	httpManager.getFuneralDetails(function(response) {
		if (response == null)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
			return;
			
		if (response.count > 0) {
			currentListPage++;
			totalListPages = Math.ceil((response.count / numberOfRecords));
			if (Object.prototype.toString.call(response.funerals) == "[object Array]") {
				loadServices(response.funerals, " ",currentListPage,totalListPages);
			} else {
				loadServices([response.funerals], " ",currentListPage,totalListPages);
			}
		} 

	}, currentListPage, numberOfRecords);
}


function onItemClick(e) {
	 utilities.disableMultiTouch(e.source);
	 var section = $.listviewServices.sections[e.sectionIndex];
	 var item = section.getItemAt(e.itemIndex);
	 if(item.properties.isLink)
	 {
	 if(Ti.Platform.osname == 'android')
	   Ti.Platform.openURL('Maps://http://maps.google.com/maps?q='+item.properties.doc.latitude +','+ item.properties.doc.longitude);
	  else
	   Ti.Platform.openURL('Maps://http://maps.google.com/maps?q='+item.properties.doc.latitude +','+ item.properties.doc.longitude);
	 }
}

function removeData() {
	arrSection = [];
	count = 0;
}
exports.removeData = removeData;