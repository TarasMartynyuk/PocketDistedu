
var loginPassWordFileName = "loginCredentials.txt";
var PathLookup = require('./PathLookup');
var ErrorHandlers = require('./ErrorHandlers');

// successCallback recieves {login, password} as argument
// errorCallback will recieve a string
function passwordValid(successCallback, errorCallback){
    // first check if file exists
    tryGetLogPassFile(function(fileEntry){
        // attempt to read login and password
        fileEntry.file(function (file) {
            var reader = new FileReader();
    
            reader.onloadend = function() {
                PathLookup.lg("Successful file read: " + this.result);
                PathLookup.lg(fileEntry.fullPath + ": " + this.result);
            };
    
            reader.readAsText(file);
    
        }, ErrorHandlers.onErrorReadFile);


    }, errorCallback("login-password file does not exist yet"));
}

function rewriteLoginPassWord(newLogin, newPassword, onFinished) {

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        var logPassDirPath = fs.root
        window.resolveLocalFileSystemURL(PathLookup.cacheRootPath, function(cacheRootDir){
            cacheRootDir.getFile(loginPassWordFileName, {create : true}, function (file){
                PathLookup.lg("created : " + file);
                PathLookup.lg("toURL() : " + file.toURL());
                PathLookup.lg("fullpath : " + file.fullPath);
                writeToFile(file, new Blob([newLogin + "\n" + newPassword]));
                
            }, ErrorHandlers.onLocalUrlError(loginPassWordFileName));
        }, ErrorHandlers.onLocalUrlError(PathLookup.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

function getLoginPassword() {
    var loginPassword = {
        login : "admin",
        password : "11111"
    }    
    return loginPassword;
}

//#region helpers
// success recieves file as argument
function tryGetLogPassFile(success, failure){

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        
        window.resolveLocalFileSystemURL(PathLookup.cacheRootPath, function(cacheRootDir){
            
            cacheRootDir.getFile(loginPassWordFileName, {create : false}, function(file){
                success(file)
            }, function(error) {
                failure(error)
            } );

        }, ErrorHandlers.onLocalUrlError(PathLookup.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

function writeToFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            PathLookup.lg("Successful file write : " + fileEntry);
            PathLookup.lg(dataObj);
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}
//#endregion

module.exports.rewriteLoginPassWord = rewriteLoginPassWord;
module.exports.printLP = printLP;
module.exports.tryGetLogPassFile = tryGetLogPassFile;
