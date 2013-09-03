define(
	['jquery', 'underscore'],
	function($, _) {
		return {
			formatGermanDatetimeToJsDate: function(datetimeString, returnWithTime) {
				if (!datetimeString) {
					console.error('No valid datetime was given to formatGermanDatetimeToJsDate()', datetimeString);
					return;
				}

				if (returnWithTime) {
					var germanDate = datetimeString.match(/^(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2})[:(\d{2})]?$/);
					return new Date(
						germanDate[3],
						germanDate[2] - 1,
						germanDate[1],
						germanDate[4],
						germanDate[5],
						germanDate[6] || '00' /* seconds-param is optional */
					);
				} else {
					var germanDate = datetimeString.match(/^(\d{2}).(\d{2}).(\d{4})$/);
					return new Date(
						germanDate[3],
						germanDate[2] - 1,
						germanDate[1]
					);
				}
			},

			formatServerDateToGermanDate: function(serverDateString, returnWithTime, timeSuffix) {
				var dateObject = this.convertDateStringToDate(serverDateString);

				var date = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : dateObject.getDate();
				var month = (dateObject.getMonth() + 1) < 10 ? '0' + (dateObject.getMonth() + 1) : (dateObject.getMonth() + 1);
				var year = dateObject.getFullYear();
				var hour = dateObject.getHours() < 10 ? '0' + dateObject.getHours() : dateObject.getHours();
				var minutes = dateObject.getMinutes() < 10 ? '0' + dateObject.getMinutes() : dateObject.getMinutes();

				var returnString = date + '.' + month + '.' + year;
				if (returnWithTime) {
					returnString += ' ' + hour + ':' + minutes;
					if (timeSuffix) {
						returnString += ' Uhr';
					}
				}

				return returnString;
			},

			getDateTimeForServer: function(datetime, returnWithTime) {
				if (!datetime) {
					console.error('No valid date was given to getDateTimeForServer()', datetime);
					return;
				}

				var year = datetime.getFullYear();
				var month = (datetime.getMonth() + 1) <= 9 ? '0' + (datetime.getMonth() + 1) : (datetime.getMonth() + 1);
				var day = datetime.getDate() <= 9 ? '0' + datetime.getDate() : datetime.getDate();

				var returnStr = year
					+ '-'
					+ month
					+ '-'
					+ day
				;

				if (returnWithTime) {
					var hours = datetime.getHours() <= 9 ? '0' + datetime.getHours() : datetime.getHours();
					var minutes = datetime.getMinutes() <= 9 ? '0' + datetime.getMinutes() : datetime.getMinutes();

					returnStr += ' '
						+ hours
						+ ':'
						+ minutes
						+ ':'
						+ '00'
					;
				}

				return returnStr;
			},

			getCurrentDate: function() {
				return this.getDateAsString(new Date());
			},

			getDateAsString: function(dateObj) {
				var date = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();
				var month = (dateObj.getMonth() + 1) < 10 ? '0' + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
				var year = dateObj.getFullYear();

				return date + '.' + month + '.' + year;
			},

			getCurrentTime: function() {
				var now = new Date();
				var currentHour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
				var currentMinutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();

				return currentHour + ':' + currentMinutes;
			},

			convertDateStringToDate: function(dateString) {
				var date = dateString.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
				var germanDate = dateString.match(/^(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);

				if (date) {
					return new Date(
						date[1],
						date[2] - 1,
						date[3],
						date[4],
						date[5],
						date[6]
					);
				} else if (germanDate) {
					return new Date(
						germanDate[3],
						germanDate[2] - 1,
						germanDate[1],
						germanDate[4],
						germanDate[5],
						germanDate[6]
					);
				}

				console.error('Could not convert "' + dateString + '" to date');
				return false;
			},

			mapElapsedTime: function(datetime) {
				var now = new Date();
				var dateOfEntry = new Date(this.convertDateStringToDate(datetime));
				var yearOfEntry = dateOfEntry.getFullYear();
				var dayOfEntry = dateOfEntry.getDate() < 10 ? '0' + dateOfEntry.getDate() : dateOfEntry.getDate();
				var monthOfEntry = (dateOfEntry.getMonth() + 1) < 10 ? '0' + (dateOfEntry.getMonth() + 1) : (dateOfEntry.getMonth() + 1);
				var hoursOfEntry = dateOfEntry.getHours() < 10 ? '0' + dateOfEntry.getHours() : dateOfEntry.getHours();
				var minutesOfEntry = dateOfEntry.getMinutes() < 10 ? '0' + dateOfEntry.getMinutes() : dateOfEntry.getMinutes();

				var diffInSeconds = (now - dateOfEntry) / 1000;
				var diffInMinutes = Math.floor(diffInSeconds / 60);
				var diffInHours = diffInMinutes / 60;

				if (diffInMinutes < 5) {
					return 'gerade eben';
				} else if(diffInMinutes <= 60) {
					return 'vor ' + diffInMinutes + 'm';
				} else if (diffInHours < 24) {
					return 'vor ca. ' + Math.round(diffInHours) + 'h';
				} else if (now.getFullYear() == yearOfEntry) {
					return dayOfEntry + '.' + monthOfEntry + '., ' + hoursOfEntry + ':' + minutesOfEntry + ' Uhr';
				} else {
					return dayOfEntry + '.' + monthOfEntry + '.' + yearOfEntry + ', ' + hoursOfEntry + ':' + minutesOfEntry + ' Uhr';
				}
			}
		};
	}
);