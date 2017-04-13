var current = new Date();
var table = document.getElementById("articleTable");
var allArticles = [];
var numDisplayed = 0;

$("button").click(function() {
	displayArticles(numDisplayed + 10);
	if (numDisplayed >= allArticles.length) {
		$("button").hide();
	}
});

loadArticles("data/articles.json", function() {
	loadArticles("data/more-articles.json", function() {
		var unpublished = document.getElementById("unpublished");
		unpublished.innerHTML += " (" + allArticles.length + ")";
		displayArticles(10);
	});
});


function loadArticles (source, callback) {
	$.getJSON(source, function(json) {
	    $.each(json, function(i, item) {
	    	item.submitDate = submitDate(item.publish_at);
	    	allArticles.push(item);
	    });
	    callback();
	});
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

function timeAgo(submitDate) {
	var result;
	var offset = current.getTime() - submitDate.getTime();
	var minutesAgo = Math.floor(offset/60000);
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

function displayArticles(numToDisplay) {
	$.each(allArticles, function(i, item) {
		if (numDisplayed <= i && i < numToDisplay) {
			addLine(item);
			numDisplayed++;
		}
	});		
}

function addLine(item) {
	var newline = "<tr>";
	
	newline += "<td>";
	newline += "<img src='" + item.image + "' style=height:50px;'>";
	newline += item.title;
	newline += "</td>";

	newline += "<td>";
	newline += item.profile.first_name;
	newline += " ";
	newline += item.profile.last_name;
	newline += "</td>";

	newline += "<td>";
	newline += item.words;
	newline += "</td>";

	newline += "<td>";
	newline += timeAgo(item.submitDate);
	//console.log(item.publish_at);
	newline += "</td>";

	newline += "</tr>";

	table.innerHTML += newline;
}
