exports.generateDatePicker = function(objdestinationLabelValue1, win, minDate, maxDate, dependent, buttonBackColor) {
	Ti.App.fireEvent("HideKeyBoard");
	if (OS_IOS) {
		var picker = Ti.UI.createPicker({
			type : Ti.UI.PICKER_TYPE_DATE,
			width : '100%',
			selectionIndicator : true,
			minDate : minDate,
			maxDate : maxDate
		});
		
		if (objdestinationLabelValue1.value.trim().length > 0) {
			Ti.API.info('>>>>>>>outside');
			if (objdestinationLabelValue1.value.trim().length != 0) {
				Ti.API.info('>>>>>>>inside');
				var previousDate = objdestinationLabelValue1.value.split('/');
				var year = previousDate[2];
				var month = previousDate[1] - 1;
				var day = previousDate[0];
				picker.value = new Date(year, month, day);
			}
		} else {
			picker.value = new Date();
		}
		var topBackView = Ti.UI.createView({
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
		});
		var doneButton = Ti.UI.createButton({
			width : (Alloy.isTablet) ? 150 : 100,
			backgroundColor : 'transparent',
			color : 'white',
			font : (Alloy.isTablet) ? Alloy.Globals.path.font18 : Alloy.Globals.path.font14,
			title : Alloy.Globals.selectedLanguage.doneTitle,
			height : (Alloy.isTablet) ? '40dp' : '30dp',
			textAlign : 'center',
			zIndex : 30,
		});

		var cancelButton = Ti.UI.createButton({
			width : (Alloy.isTablet) ? 150 : 100,
			backgroundColor : 'transparent',
			color : 'white',
			font : (Alloy.isTablet) ? Alloy.Globals.path.font18 : Alloy.Globals.path.font14,
			title : Alloy.Globals.selectedLanguage.cancel,
			height : (Alloy.isTablet) ? '40dp' : '30dp',
			textAlign : 'center',
			zIndex : 30,
		});
		if (Alloy.Globals.isEnglish) {
			doneButton.left = 0;
			cancelButton.left = (Alloy.isTablet) ? 170 : 120;
		} else {
			doneButton.right = 0;
			cancelButton.right = (Alloy.isTablet) ? 170 : 120;
		}

		topBackView.add(doneButton);
		topBackView.add(cancelButton);

		var animation = Ti.UI.createAnimation({
			bottom : 0,
			duration : 500
		});
		var clearView = Ti.UI.createView({
			backgroundColor : (Ti.Platform.osname == 'android') ? '#261f68' : 'transparent',
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,

		});

		var backView = Ti.UI.createView({
			width : '100%',
			height : (Alloy.isTablet) ? '256' : '246dp',
			layout : 'vertical',
			bottom : '-250dp',
			zIndex : 25,
			backgroundColor : buttonBackColor
		});
		backView.add(topBackView);
		backView.add(picker);
		clearView.add(backView);
		win.add(clearView);

		backView.animate(animation);
		cancelButton.addEventListener('click', function() {
			var anim = Ti.UI.createAnimation({
				bottom : '-250dp',
				duration : 500
			});
			var animComplete = function() {
				anim.removeEventListener('complete', animComplete);

				clearView.remove(backView);
				win.remove(clearView);
				picker = undefined;
			};

			anim.addEventListener('complete', animComplete);
			backView.animate(anim);
		});

		doneButton.addEventListener('click', function() {
			var pickerdate = picker.value;
			var day = pickerdate.getDate();
			var month = pickerdate.getMonth() + 1;
			var year = pickerdate.getFullYear();
			if (day < 10)
				day = '0' + day;
			//service givin error if we are not passing as two digits
			if (month < 10)
				month = '0' + month;
			//service givin error if we are not passing as two digits

			var newdate = day + "/" + month + "/" + year;
			var newdate1 = day + "/" + month + "/" + year;

			//objdestinationLabel.text = newdate;
			objdestinationLabelValue1.value = newdate1;
			if (dependent != undefined) {
				dependent.value = newdate1;
			}
			//objdestinationLabel.color = objdestinationLabelValue1.color = Alloy.Globals.path.formFieldsColor;

			var anim = Ti.UI.createAnimation({
				bottom : '-250dp',
				duration : 500
			});
			var animComplete = function() {
				anim.removeEventListener('complete', animComplete);

				clearView.remove(backView);
				win.remove(clearView);
				picker = undefined;
			};

			anim.addEventListener('complete', animComplete);
			backView.animate(anim);
		});
	} else {
		var picker = Ti.UI.createPicker({
			type : Ti.UI.PICKER_TYPE_PLAIN,
			minDate : minDate,
			maxDate : maxDate
		});
		// picker.minDate = minDate;
		// picker.maxDate = maxDate;
		var previousDate,
		    previousYear,
		    previousMonth,
		    previousDay,
		    defaultDateValue;
		if (objdestinationLabelValue1.value.trim().length > 0) {
			previousDate = objdestinationLabelValue1.value.split('/');
			previousYear = previousDate[2];
			previousMonth = previousDate[1] - 1;
			previousDay = previousDate[0];
			//picker.value = new Date(year,month,day);
			defaultDateValue = new Date(previousYear, previousMonth, previousDay);
			Ti.API.info('defaultDateValue If == ' + defaultDateValue);
		} else {
			defaultDateValue = new Date();
			Ti.API.info('defaultDateValue ELSE == ' + defaultDateValue);
		}

		picker.showDatePickerDialog({
			value : defaultDateValue, // some date
			callback : function(e) {
				if (e.cancel) {
					Ti.API.info('user canceled dialog');
				} else {
					Ti.API.info('value is: ' + e.value);
					var pickerdate = e.value;
					var today = new Date();
					var day = pickerdate.getDate();
					var month = pickerdate.getMonth() + 1;
					var year = pickerdate.getFullYear();
					if (day < 10)
						day = '0' + day;
					//service givin error if we are not passing as two digits
					if (month < 10)
						month = '0' + month;
					//service givin error if we are not passing as two digits

					var newdate = day + "/" + month + "/" + year;
					var newdate1 = day + "/" + month + "/" + year;

					//objdestinationLabel.text = newdate;
					objdestinationLabelValue1.value = newdate1;
					if (dependent != undefined) {
						dependent.value = newdate1;
					}
					//alert(String.formatDate(selectedDate, 'medium'));
					//objdestinationLabel.color = objdestinationLabelValue1.color = Alloy.Globals.path.formFieldsColor;
				}
			}
		});
	}

};
