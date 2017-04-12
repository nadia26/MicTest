var unpublished = document.getElementById("unpublished");
unpublished.innerHTML += "()";



$.getJSON("data/articles.json", function(json) {
    $.each(json, function(i, item) {
    	addLine(item);
    });
});


$.getJSON("data/more-articles.json", function(json) {
    $.each(json, function(i, item) {
    	addLine(item);
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