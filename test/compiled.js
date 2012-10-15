











 function __error(message, file, line) {
  throw new Error(message + "(" + file + ":" + line + ")");
 }


var Utils = {
 logger : function(message) {
  do { if(!(typeof message === "string")) { __error("assertion failed: " + "typeof message === \"string\"" + " = " + (typeof message === "string"), "utils.js", 7); } } while(false);
  console.log(message);
 }
};







Utils.logger("hello");






Utils.logger("ballo");






Utils.logger("foobar");



Utils.logger("That's all folks!");

//@ sourceMappingURL=compiled.js.map