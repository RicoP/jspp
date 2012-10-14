#!/usr/bin/node

var sm = require("source-map");
var argv = require('optimist').argv;
var fs = require("fs"); 

(function() { 
	"use strict"; 

	var sourceRoot = argv.r || argv.root || "."; 
	var fileName   = argv.f || argv.file || undefined; 
	var sourceMapName = argv.s || argv.sourcemap || undefined; 

	if(!fileName) {
		throw new Error("Must specify filename."); 
	}

	if(!sourceMapName) {
		throw new Error("Must specify source-map."); 
	}

	var smg = new sm.SourceMapGenerator({ file : fileName, sourceRoot : sourceRoot });

	var sources = []; 

	var currentLine = {
		line : 0, 
		file : ""
	};

	function processHash(currentline, linenum) {
		var elem = currentline.split(/ /); 
		var sourcelinenum = parseInt(elem[1], 10); 
		var sourcefileName = elem[2].trim(); 

		//remove trailing "
		sourcefileName = sourcefileName.substring(1, sourcefileName.length-1); 

		//console.log(fileName); 
		if(sourcefileName === '<built-in>' || sourcefileName === '<command-line>') {
			return; 
		}

		/*if(sources.indexOf(fileName) === -1) {
			sources.push(fileName); 
		}*/

		//console.log("MAP", currentLine, lineNum, fileName); 

		/*smg.addMapping({
			generated : { line : currentLine+1, column : 1 },
			original : { line : lineNum, column : 1 }, 
			source : fileName
		});*/
		currentLine.line = sourcelinenum+1; 
		currentLine.file = sourcefileName;
	}

	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	process.stdin.on('data', function (chunk) {
		var allText = chunk.toString(); 
		var lines = allText.split(/[\n\r]/); 

		var linenum = 1; 
		for(var i = 0; i !== lines.length; i++) {
			var line = lines[i]; 

			if(line.charAt(0) !== "#") {
				process.stdout.write(line); 

				console.error(
					"MAP", currentLine.file, ":", linenum+1, "->", currentLine.line-1
				);
				smg.addMapping({
					generated : { line : linenum+1,          column : 1 },
					original  : { line : currentLine.line-1, column : 1 }, 
					source    : currentLine.file
				});
			} else {
				//process # 
				processHash(line, i+1); 
			}

			currentLine.line++; 
			linenum++; 
			process.stdout.write("\n"); 
		}

		process.stdout.write("//@ sourceMappingURL=");
		process.stdout.write(sourceMapName);
	});

	process.stdin.on('end', function () {
		fs.writeFileSync(sourceMapName, smg.toString()); 
	});
}()); 
