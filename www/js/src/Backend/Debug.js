// for testing, place them in root;
function init() {

    var debug = false; // when in browser, that is
    var cacheRootPath = debug? "filesystem:http://192.168.0.103:3000/persistent/" : cordova.file.externalDataDirectory;
//     var cacheRootPath = "filesystem:http://192.168.0.103:3000/persistent/";
    
    var lg;
    var lge;
    if (debug) {
        lg = console.log;
        lge = console.error;

    } else {
                //#region logger
                var logfilePath = // debug? "filesystem:http://192.168.0.103:3000/persistent/" + "PocketDisteduLog.txt": 
                // cordova.file.externalRootDirectory +
                cacheRootPath + "PocketDisteduLog.txt";
        
                // setup a logfile path (required) 
                // this path is relative to your device sdcard storage directory 
                window.logToFile.setLogfilePath(logfilePath, function () {
                // logger configured successfully   
                console.log("LOGFILE CREATED: " + logfilePath);
                
                }, function (err) {
                // logfile could not be written 
                // handle error 
                    console.error("LOGGER ERRROR - " + logfilePath + " : ");
                    console.error(err);
                });
        
                lg = function (message) {
                    window.logToFile.debug(message);
                }
        
                lge = function(message) {
                    window.logToFile.error(message);
                }
            //#endregion
        
    }
    

    // var lg = debug? console.log : log;
    // var lge = debug? console.error : logError;
    
    // function log(message) {
        
    //         logP = document.createElement("p");
    //         $(logP).text(message);
    //         $('#console').append(logP);
    // }

    // function logError(message) {
        
    //         logP = document.createElement("p");
    //         $(logP).text(message);
    //         $(logP).css('color', 'red');
    //         $('#console').append(logP);
    // }

    module.exports.cacheRootPath = cacheRootPath;
    module.exports.lg = lg;
    module.exports.lge = lge;    
}

module.exports.init = init;

