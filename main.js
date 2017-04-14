var current = new Date();
var table = $("#tableBody");
var loadmore = $("#loadmore");
var words = $("#words");
var submitted = $("#submitted");

var allArticles = [];
var displayedArticles = [];

console.log(localStorage);

loadArticles("data/articles.json", function() {
	loadArticles("data/more-articles.json", function() {
		var unpublished = $("#unpublished");
		unpublished.append(" (" + allArticles.length + ")");
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


loadmore.click(function() {
	displayArticles(displayedArticles.length + 10);
	if (displayedArticles.length >= allArticles.length) {
		loadmore.hide();
	}
});

words.click(function () {
	wordSort();
});	


submitted.click(function() {
	submittedSort();
});	

function wordSort() {
	localStorage.setItem("sort", "words");
	displayedArticles = displayedArticles.sort(function(a, b) {
		return a.words - b.words;
	});
	reDisplay();
}

function submittedSort() {
	localStorage.setItem("sort", "submited");
	displayedArticles = displayedArticles.sort(function(a, b) {
		return a.minutesAgo - b.minutesAgo;
	});
	reDisplay();	
}


function reDisplay() {
	table.html(null);
	$.each(displayedArticles, function(i, item) {
		addLine(item);
	});
}	


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

function displayArticles(numToDisplay) {
	$.each(allArticles, function(i, item) {
		if (displayedArticles.length <= i && i < numToDisplay) {
			addLine(item);
			displayedArticles.push(item);
		}
	});	
	localStorage.setItem("displayNum", displayedArticles.length);	
}

function submitDate(timestamp) {
	var year = timestamp.substring(0,4);
	var month = timestamp.substring(5,7) - 1; //months in base 0
	var day = timestamp.substring(8,10);
	var hour = timestamp.substring(11,13);
	var minute = timestamp.substring(14,16);
	var submitDate = new Date(year, month, day, hour, minute);
	return submitDate;
}

function minutesAgo(submitDate) {
	var offset = current.getTime() - submitDate.getTime();
	var minutesAgo = Math.floor(offset/60000);
	return minutesAgo;
}

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
