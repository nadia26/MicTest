var table = document.getElementById("articleTable");
var allArticles = [];
var numDisplayed = 0;



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
	    	allArticles.push(item);
	    });
	    callback();
	});
}

function displayArticles(numToDisplay) {
	$.each(allArticles, function(i, item) {
		if (numDisplayed < numToDisplay) {
			addLine(item);
			numDisplayed++;
		}
	});		
}

function addLine(item) {
	var newline = "<tr>";
	
	newline += "<td>";
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
	newline += item.publish_at;
	newline += "</td>";

	newline += "</tr>";

	table.innerHTML += newline;
}
