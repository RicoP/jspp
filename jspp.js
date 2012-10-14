#!/usr/bin/node

var sm = require("source-map");
var argv = require('optimist').argv;

(function() { 
	"use strict"; 

	var sourceRoot = argv.r || argv.root || undefined; 
	var fileName   = argv.f || argv.file || undefined; 

	if(!fileName) {
		throw new Error("Must specify filename."); 
	}

	var smg = new sm.SourceMapGenerator({ file : fileName, sourceRoot : sourceRoot });

	var sources = []; 

	function processHash(line, currentLine) {
		var elem = line.split(/ /); 
		var lineNum = parseInt(elem[1], 10); 
		var fileName = elem[2].trim(); 

		//remove trailing "
		fileName = fileName.substring(1, fileName.length-1); 

		//console.log(fileName); 
		if(fileName === '<built-in>' || fileName === '<command-line>') {
			return; 
		}

		if(sources.indexOf(fileName) === -1) {
			sources.push(fileName); 
		}

		//console.log("MAP", currentLine, lineNum, fileName); 

		smg.addMapping({
			generated : { line : currentLine+1, column : 1 },
			original : { line : lineNum, column : 1 }, 
			source : fileName
		});
	}

	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	process.stdin.on('data', function (chunk) {
		var allText = chunk.toString(); 
		var lines = allText.split(/[\n\r]/); 

		for(var i = 0; i !== lines.length; i++) {
			var line = lines[i]; 

			if(line.charAt(0) !== "#") {
				process.stdout.write(line); 
			} else {
				//process # 
				processHash(line, i+1); 
			}

			process.stdout.write("\n"); 
		}
	});

	process.stdin.on('end', function () {
		console.log(smg.toString()); 
	});
}()); 
