var args = arguments[0] || {};

var httpManager = require("httpManager");
var sWindow,
    isMenuExist = false,
    menu;
    
Ti.API.info('bottomMenu');

function addBottomMenu(){
	Ti.API.info('menuu=='+menu);
	
	if(!isMenuExist){
		Ti.API.info('isMenuExist=='+isMenuExist);
		menu = require('animate').createMenu({
			iconList: [
				{ image: Alloy.Globals.path.menuNews, id: 'News' },
				{ image: Alloy.Globals.path.menuServices, id: 'Services' },
				{ image: Alloy.Globals.path.menuEvents, id: 'Events' },
				{ image: Alloy.Globals.path.menuFeedback, id: 'Feedback' },
				{ image: Alloy.Globals.path.menuJnazah, id: 'Jnazah' },
				{ image: Alloy.Globals.path.menuContactUs, id: 'Contact Us' },
				{ image: Alloy.Globals.path.menuAbout, id: 'About' },
				]
			});

		menu.addEventListener('iconClick', openMenuWindow);
	
	isMenuExist = true;	
	$.viewBottomMenu.add(menu);
		
	}else{
		Ti.API.info('isMenuExist=='+isMenuExist);
		$.viewBottomMenu.remove(menu);
		menu = null;
		//menu.removeEventListener(openMenuWindow);
		
		menu = require('animate').createMenu({
			iconList: [
				{ image: Alloy.Globals.path.menuNews, id: 'News' },
				{ image: Alloy.Globals.path.menuServices, id: 'Services' },
				{ image: Alloy.Globals.path.menuEvents, id: 'Events' },
				{ image: Alloy.Globals.path.menuFeedback, id: 'Feedback' },
				{ image: Alloy.Globals.path.menuJnazah, id: 'Jnazah' },
				{ image: Alloy.Globals.path.menuContactUs, id: 'Contact Us' },
				{ image: Alloy.Globals.path.menuAbout, id: 'About' },
				]
			});

		menu.addEventListener('iconClick', openMenuWindow);
	
	isMenuExist = true;	
	$.viewBottomMenu.add(menu);
		
	}
}

function openMenuWindow(e){
	Ti.API.info('button iconClick ==='+e.id);

	if(e.id == "News"){
		try{
			sWindow = Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length-1];
			if(sWindow.id == "winNewsList" && Alloy.Globals.isFavourite == false){
				Alloy.Globals.showBackView(false);
				isMenuExist = true;
				if(OS_ANDROID){
					setTimeout(function(){
						addBottomMenu();
					},1000);
				}else{
					addBottomMenu();
				}
				return;
			}else{			
				var payLoad = {
					isFromMenu : true,
				
				};	
		     	Alloy.Globals.openWindow(Alloy.createController("News/winNewsList", payLoad).getView());
		     	Alloy.Globals.isFavourite = false;	
		   }
		}catch(e){
			Ti.API.info('Error Message '+JSON.stringify(e));
		}
		
	}else if(e.id == "Services"){
		try{
			sWindow = Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length-1];
			//if(sWindow.id == "winServicesLanding"){
			if(sWindow.id == "winServices"){
				
				Alloy.Globals.showBackView(false);
				isMenuExist = true;
				if(OS_ANDROID){
					setTimeout(function(){
						addBottomMenu();
					},1000);
				}else{
					addBottomMenu();
				}
				return;
			}
			else {

				var payLoad = {
					isFromMenu : true,
				};

				//Alloy.Globals.openWindow(Alloy.createController("Services/winServicesLanding", payLoad).getView());
				Alloy.Globals.openWindow(Alloy.createController("Services/servicesWebView", payLoad).getView());
			}

		}catch(e){
			Ti.API.info('Error Message '+JSON.stringify(e));
		}
	}else if(e.id == "Events"){ 
		try{
			sWindow = Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length-1];
			if(sWindow.id == "winEventsList" && Alloy.Globals.isFavourite == false){
				Alloy.Globals.showBackView(false);
				isMenuExist = true;
				if(OS_ANDROID){
					setTimeout(function(){
						addBottomMenu();
					},1000);
				}else{
					addBottomMenu();
				}
				return;
			}else{					
						 
				var payLoad = {
					isFromMenu : true,
				};
				Alloy.Globals.openWindow(Alloy.createController("Events/winEventsList", payLoad).getView()); 
				Alloy.Globals.isFavourite = false;
		   }
		}catch(e){
			Ti.API.info('Error Message '+JSON.stringify(e));
		}
	}else if(e.id == "Feedback"){
		try{
			sWindow = Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length-1];
			if(sWindow.id == "winFeedback"){
				Alloy.Globals.showBackView(false);
				isMenuExist = true;
				if(OS_ANDROID){
					setTimeout(function(){
						addBottomMenu();
					},1000);
				}else{
					addBottomMenu();
				}
				return;
			}else{
				var payLoad = {
					isFromMenu : true
				};
				Alloy.Globals.openWindow(Alloy.createController("Feedback/winFeedback", payLoad).getView());
			}
		}catch(e){
			Ti.API.info('Error Message '+JSON.stringify(e));
		}
		
	}else if(e.id == "Jnazah"){
		try{
			sWindow = Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length-1];
			if(sWindow.id == "winJnazahLanding"){
				Alloy.Globals.showBackView(false);
				isMenuExist = true;
				if(OS_ANDROID){
					setTimeout(function(){
						addBottomMenu();
					},1000);
				}else{
					addBottomMenu();
				}
				return;
			}else{
				
				var payLoad = {
					isFromMenu : true
				};
					Alloy.Globals.openWindow(Alloy.createController("Jnazah/winJnazahLanding",payLoad).getView());
			
			}
		}catch(e){
			Ti.API.info('Error Message '+JSON.stringify(e));
		}
	}else if(e.id == "Contact Us"){	
		try{
			sWindow = Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length-1];
			if(sWindow.id == "winContactUs"){
				Alloy.Globals.showBackView(false);
				isMenuExist = true;
				if(OS_ANDROID){
					setTimeout(function(){
						addBottomMenu();
					},1000);
				}else{
					addBottomMenu();
				}					
				return;
			}else{
				var payLoad = {
					isFromMenu : true
				};
				Alloy.Globals.openWindow(Alloy.createController("ContactUs/winContactUs",payLoad).getView());					
			}
		}catch(e){
			Ti.API.info('Error Message '+JSON.stringify(e));
		}					
	}else if(e.id == "About"){
		try{
			sWindow = Alloy.Globals.arrWindows[Alloy.Globals.arrWindows.length-1];
			if(sWindow.id == "winAboutLanding"){
				Alloy.Globals.showBackView(false);
				isMenuExist = true;
				if(OS_ANDROID){
					setTimeout(function(){
						addBottomMenu();
					},1000);
				}else{
					addBottomMenu();
				}
				return;
			}else{
				httpManager.getOverViewDetails(function(response) {
					if (response == null)
						return;
						
					var payLoad = {
						isFromMenu : true,
						data : response
					};							
				    Ti.API.info("about us response "+JSON.stringify(response));		
					Alloy.Globals.openWindow(Alloy.createController("About/winAboutLanding",payLoad).getView());
				}); 
			}
		}catch(e){
			Ti.API.info('Error Message '+JSON.stringify(e));
		}
		
	} 
	$.viewBottomMenu.visible = true;
	return;
	
	Ti.API.info(e.source);
	Ti.API.info(e.index);
	Ti.API.info(e.id);
	label.text = 'index: ' + e.index + '\nid: ' + (e.id ? e.id : 'undefined');	
};



exports.addInnerMenu = function(){
	addBottomMenu();
};



var label = Ti.UI.createLabel({
	text: 'index: ???\nid: ???',
	color: '#222',
	font: {
		fontSize: 24,
		fontWeight: 'bold'	
	},
	textAlign: 'center'
});


var button = Ti.UI.createButton({
	title: 'reset menu',
	width: 120,
	height: 40,
	top: 20
});
button.addEventListener('click', function(e) {
	menu.initMenu();
//	label.text = 'index: ???\nid: ???';
});

//$.winNews.add(label);
//$.winNews.add(button);

exports.hideBottomMenu = function(){
   $.viewBottomMenu.visible = false;
};

exports.showBottomMenu = function(){
   $.viewBottomMenu.visible = true;
};

Alloy.Globals.showBackView = function(e){
	Ti.API.info('e'+JSON.stringify(e));
	try{
		if(!e){
			//$.viewBottomMenu.viewBack.visible = false;
			Alloy.Globals.bottomMenu.visible = false;
		}else{
			Alloy.Globals.bottomMenu.visible = true;
			//$.viewBottomMenu.viewBack.visible = true;
		}
	}
	catch(e){
		Ti.API.info('Error '+JSON.stringify(e.message));
	}
	
};
