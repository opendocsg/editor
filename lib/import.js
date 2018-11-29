var mammoth = require('mammoth');
var TurndownService = require('turndown');

var detectUpload = function(){
	document.getElementById("base64").value = "";
	var x = document.getElementById("docupload");
    if ('files' in x) {
        if (x.files.length != 0) {
			file = x.files[0];
            if ('name' in file) {
				var ext = file.name.split('.').pop();
                if (ext == "doc" || ext == "docx") {
					readFileInputEventAsArrayBuffer(function(arrayBuffer) {
						mammoth.convertToHtml({arrayBuffer: arrayBuffer})
							.then(function(result){
								var html = result.value; // The generated HTML
								var messages = result.messages; // Any messages, such as warnings during conversion)
								/*if (messages != "") { //Sometimes causes weird alerts
									alert(messages);
								}*/
								var count = html.split('base64,').length - 1;
								var array = [];
								var indexTracker = 0;
								for (var i = 0; i < count; i++){
									var startIndex = html.indexOf('base64,', indexTracker) + 7;
									var endIndex = html.indexOf('"', startIndex);
									var base64 = html.slice(startIndex, endIndex);
									array.push(base64);
									indexTracker = endIndex;
								}
								document.getElementById("base64").value = array.toString();
								//HTML to Markdown
								var count = 0;
								var turndownService = new TurndownService({headingStyle: 'atx'});
								turndownService.addRule('image', {
									filter: 'img',
									replacement: function (content) {
										count += 1;
										return '![Alternative Text](images/'+count+'.png)';
									}
								})
								var markdown = turndownService.turndown(html);
								editor.setMarkdown(markdown);
						});
					})
				} else if (ext == "md") {
					readFileInputEventAsText(function(text) {
						editor.setMarkdown(text);	
					})
				} else {
					alert("Please select a valid file!");
				}
            }
        }
    }
    else {
        if (x.value == "") {
            alert("Please select a valid file!");
        } else {
			alert("This function is not supported by your browser!")
        }
    }
}

function readFileInputEventAsArrayBuffer(callback) {
	var reader = new FileReader();
	reader.onload = function(loadEvent) {
		var arrayBuffer = loadEvent.target.result;
		callback(arrayBuffer);
	};
	reader.readAsArrayBuffer(file);
}

function readFileInputEventAsText(callback) {
	var reader = new FileReader();
	reader.onload = function(loadEvent) {
		var text = loadEvent.target.result;
		callback(text);
	};
	reader.readAsText(file);
}

module.exports = {detectUpload: detectUpload};