// for testing, place them in root;
function init() {
    var debug = true; // when in browser, that is
    var cacheRootPath = debug? "filesystem:http://192.168.0.103:3000/persistent/" : cordova.file.dataDirectory;
    var lg = debug? console.log : log;
    var lge = debug? console.error : log;
    
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
}

module.exports.init = init;

