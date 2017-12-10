
var  loginPassWordFileName = "loginCredentials.txt";

// successCallback recieves {login, password} as argument
function passwordValid(successCallback, errorCallback){
    
}

function rewriteLoginPassWord(newLogin, newPassword) {
    var logPasName = this.loginPassWordFileName;
    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        var logPassDirPath = fs.root
        window.resolveLocalFileSystemURL(PathLookup.cacheRootPath, function(cacheRootDir){
            cacheRootDir.getFile(logPasName, {create : true}, function (file){
                console.log("created : " + file);
                console.log("toURL() : " + file.toURL());
                console.log("fullpath : " + file.fullPath);
                writeToFile(file, new Blob([newLogin + "\n" + newPassword]));
                
            }, onLocalUrlError(logPasName));
        }, onLocalUrlError(PathLookup.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

function printLP() {
    console.log("LOGINPASS");
}

function getLoginPassword() {
    var loginPassword = {
        login : "admin",
        password : "11111"
    }    
    return loginPassword;
}
    
function writeToFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write : " + fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}

module.exports.rewriteLoginPassWord = rewriteLoginPassWord;
module.exports.printLP = printLP;