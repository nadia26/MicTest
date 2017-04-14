var table = $("#tableBody");
var loadmore = $("#loadmore"); //load more button
var words = $("#words"); //button to sort by word count
var submitted = $("#submitted"); //button to sort by time-ago
var current = new Date();

var allArticles = []; //will store all articles in both json files
var displayedArticles = []; //stores articles as currently displayed


loadArticles("data/articles.json", function() {
	loadArticles("data/more-articles.json", function() {
		//fill in number of unpublished articles
		var unpublished = $("#unpublished");
		unpublished.append(" (" + allArticles.length + ")");

		//check on data stored from previous page visits
		if (localStorage.length == 0) {
			displayArticles(10);
		} else {
			displayArticles(localStorage.getItem("displayNum"));
			var sortType = localStorage.getItem("sort");
			if (sortType == "words") {
				wordSort();
			} else if (sortType == "submitted") {
				submittedSort();
			}
		}
	});
});
 
//on "load more" click, display 10 more articles
loadmore.click(function() {
	displayArticles(displayedArticles.length + 10);
	if (displayedArticles.length >= allArticles.length) {
		loadmore.hide(); //if there are none, hide the button
	}
});

//on clicking "words" at top of column
words.click(function () {
	wordSort();
});	

//on clicking "submitted" at top of column
submitted.click(function() {
	submittedSort();
});	


//store data from given source file
//callback function to ensure that data is loaded before anything starts to display
function loadArticles (source, callback) {
	$.getJSON(source, function(json) {
	    $.each(json, function(i, item) {
	    	item.submitDate = submitDate(item.publish_at);
	    	item.minutesAgo = minutesAgo(item.submitDate);
	    	item.timeAgo = timeAgo(item.minutesAgo);
	    	allArticles.push(item);
	    });
	    callback();
	});
}

//display more articles such that the total being displayed matches numToDisplay paramter
function displayArticles(numToDisplay) {
	$.each(allArticles, function(i, item) {
		if (displayedArticles.length <= i && i < numToDisplay) {
			addLine(item);
			displayedArticles.push(item);
		}
	});	
	localStorage.setItem("displayNum", displayedArticles.length);	
}


//sort articles currently being displayed by word count
function wordSort() {
	localStorage.setItem("sort", "words");
	displayedArticles = displayedArticles.sort(function(a, b) {
		return a.words - b.words;
	});
	reDisplay();
}

//sort articles currently being displayed by time submitted
function submittedSort() {
	localStorage.setItem("sort", "submited");
	displayedArticles = displayedArticles.sort(function(a, b) {
		return a.minutesAgo - b.minutesAgo;
	});
	reDisplay();	
}

//sort helper function; repopulate table based on new order
function reDisplay() {
	table.html(null);
	$.each(displayedArticles, function(i, item) {
		addLine(item);
	});
}	


//takes a timestamp string, returns a corresponding Date object
function submitDate(timestamp) {
	var year = timestamp.substring(0,4);
	var month = timestamp.substring(5,7) - 1; //months in base 0
	var day = timestamp.substring(8,10);
	var hour = timestamp.substring(11,13);
	var minute = timestamp.substring(14,16);
	var submitDate = new Date(year, month, day, hour, minute);
	return submitDate;
}

//returns number of minutes since given date object
//compared against "current" set on page load
function minutesAgo(submitDate) {
	var offset = current.getTime() - submitDate.getTime();
	var minutesAgo = Math.floor(offset/60000);
	return minutesAgo;
}

//given how many minutes ago an article was submitted,
//returns a string approximation of how long ago that was
function timeAgo(minutesAgo) {
	var result;
	var hoursAgo = Math.floor(minutesAgo/60);
	var daysAgo = Math.floor(hoursAgo/24);
	var weeksAgo = Math.floor(daysAgo/7);
	var monthsAgo = Math.floor(daysAgo/30);
	var yearsAgo = Math.floor(daysAgo/365);
	if (yearsAgo > 0) {
		result = yearsAgo + " years";
	} else if (monthsAgo > 0) {
		result = monthsAgo + " months";
	} else if (weeksAgo > 0) {
		result = weeksAgo + " weeks";
	} else if (daysAgo > 0) {
		result = daysAgo + " days";
	} else if (hoursAgo > 0) {
		result = hoursAgo + " hours";
	} else if (minutesAgo > 0) {
		result = minutesAgo + " minutes";
	} else {
		result = "just now";
		return result;
	}
	if (result.substring(0,2) == "1 ") {
		result = result.substring(0, result.length - 1);
	}
	result += " ago";
	return result;
}

//given an item from a json file, adds a line to the displayed table the item's 
function addLine(item) {
	var newline = "<tr>";
	
	newline += "<td class='title'>";
	newline += "<span><img src='" + item.image + "'></span>"
	newline += "<p>" + item.title + "</p>";
	newline += "</td>";

	newline += "<td class='author'>";
	newline += item.profile.first_name;
	newline += " ";
	newline += item.profile.last_name;
	newline += "</td>";

	newline += "<td class='words'>";
	newline += item.words;
	newline += "</td>";

	newline += "<td class='submitted'>";
	newline += item.timeAgo;
	newline += "</td>";

	newline += "</tr>";

	table.append(newline);
}
