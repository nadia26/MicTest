var unpublished = document.getElementById("unpublished");


var numArticles = 0;

function parseArticles (source, callback) {
	$.getJSON(source, function(json) {
		numArticles += json.length;
		//console.log(numArticles);
		callback();
	    $.each(json, function(i, item) {
	    	addLine(item);
	    });
	});
}

parseArticles("data/articles.json", function() {
	parseArticles("data/more-articles.json", function() {
		var unpublished = document.getElementById("unpublished");
		unpublished.innerHTML += " (" + numArticles + ")";
	});
});



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

	document.getElementById("articleTable").innerHTML += newline;
}
