var JSZip = require('jszip');
var FileSaver = require('file-saver');

var generateZip = function(output, filename){
	var zip = new JSZip();
	zip.file(filename, output);
	var img = zip.folder("images");
	var html = document.getElementById("base64").value;
	var base64 = html.split(',');
	for (var i = 0; i < base64.length; i++){
		img.file(String(i+1)+".png", base64[i], {base64: true});
	}
	zip.generateAsync({type:"blob"}).then(function(blob) {
		FileSaver.saveAs(blob, "package.zip");
	}, function(err) {
		alert(err.message);
	});
}

module.exports = {generateZip: generateZip};
