// for testing, place them in root;
function init() {
    var debug = false; // when in browser, that is
//     var cacheRootPath = debug? "filesystem:http://192.168.0.103:3000/persistent/" : cordova.file.dataDirectory;
    var cacheRootPath = "filesystem:http://192.168.0.103:3000/persistent/";
    var lg = debug? console.log : log;
    var lge = debug? console.error : logError;
    
    function log(message) {
        
            logP = document.createElement("p");
            $(logP).text(message);
            $('#console').append(logP);
    }

    function logError(message) {
        
            logP = document.createElement("p");
            $(logP).text(message);
            $(logP).css('color', 'red');
            $('#console').append(logP);
    }

    module.exports.cacheRootPath = cacheRootPath;
    module.exports.lg = lg;
    module.exports.lge = lge;    
}

module.exports.init = init;

