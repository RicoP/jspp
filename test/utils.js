#ifndef UTILS_JS 
#define UTILS_JS 
#include "assert.js" 

var Utils = {
	logger : function(message) {
		assert(typeof message === "string"); 
		console.log(message); 
	}
};

#endif 
