var mammoth = require("mammoth");
var TurndownService = require('turndown');

var detectUpload = function(){
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
								if (messages != "") {
									alert(messages);
								}
								//HTML to Markdown
								var turndownService = new TurndownService({headingStyle: 'atx'});
								var markdown = turndownService.turndown(html);
								document.getElementById("markdown").value = markdown;
								location.reload(); 
						});
					})
				} else if (ext == "md") {
					readFileInputEventAsText(function(text) {
						document.getElementById("markdown").value = text;
						location.reload();
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
