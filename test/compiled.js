











 function __error(message, file, line) {
  throw new Error(message + "(" + file + ":" + line + ")");
 }


var Utils = {
 logger : function(message) {
  do { if(!(typeof message === "string")) { __error("assertion failed: " + "typeof message === \"string\"" + " = " + (typeof message === "string"), "utils.js", 7); } } while(false);
  console.log(message);
 }
};



(function() {

Utils.logger("Hello world");

}());

//@ sourceMappingURL=compiled.js.map