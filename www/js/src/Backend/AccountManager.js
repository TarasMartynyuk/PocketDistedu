
var loginPassWordFileName = "loginCredentials.txt";
var logPasBackupName = "loginCredentialsBACKUP.txt";
var Debug = require('./Debug');
var ErrorHandlers = require('./ErrorHandlers');
var loginURL = "http://distedu.ukma.edu.ua/login/index.php";
var savedLogin;
var savedPassword;

// successCallback recieves {login, password} as argument
// errorCallback will recieve a string
function passwordValid(successCallback, errorCallback) {
    // first check if file exists
    getLoginPassword(function(logPas){
        // try to login into distedu
        Debug.lg(logPas.login);
        Debug.lg(logPas.password);
        login = logPas.login + "dasdsadsa";
        password = logPas,password;
        
        tryAuthenticate( function(data) {
            // the server returns login page if the password/name was not valid
                Debug.lg(" POST RESULT : \n\n\n" + $(data).find('title'));
                // Debug.lg(" POST RESULT : \n\n\n" + data);
                
                $.ajax({
                    type : "GET",
                    url : "http://distedu.ukma.edu.ua/mod/resource/index.php?id=131",
                success : function(data) {
                    Debug.lg('success with GET\n\n\n');
                    Debug.lg($(data).find('title'));
                    // Debug.lg(data);
                },
                error : function(err) {
                    Debug.lge(err);
                }
            });
            // Debug.lg("posted");
            // Debug.lg(data);
        }, function (error) {
            Dubug.lge(error);
        });
    }, function(error) {
      errorCallback(error);
    });
}

function rewriteLoginPassWord(newLogin, newPassword, onFinished) {

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        var logPassDirPath = fs.root
        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
            cacheRootDir.getFile(loginPassWordFileName, {create : true}, function (file){
                Debug.lg("created : " + file);
                Debug.lg("toURL() : " + file.toURL());
                Debug.lg("fullpath : " + file.fullPath);
                writeToFile(file, new Blob([newLogin + "\n" + newPassword]));
                
            }, ErrorHandlers.onLocalUrlError(loginPassWordFileName));
        }, ErrorHandlers.onLocalUrlError(Debug.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

// successCallback recieves {login, password} as argument
function getLoginPassword(success, failure) {
    
    tryGetLogPassFile(function(fileEntry){
        // attempt to read login and password
        fileEntry.file(function (file) {
            var reader = new FileReader();
    
            reader.onloadend = function() {
                var contents = this.result.split('\n');

                success({
                    login : contents[0],
                    password : contents[1]
                });
            };
    
            reader.readAsText(file);
    
        }, ErrorHandlers.onErrorReadFile);


    }, function(error) {
        failure("login-password file does not exist yet");
    });
}

//#region helpers
// success recieves file as argument
function tryGetLogPassFile(success, failure){

    failure = failure || ErrorHandlers.onLocalUrlError(Debug.cacheRootPath + loginPassWordFileName);

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        
        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
            
            cacheRootDir.getFile(loginPassWordFileName, {create : false}, function(file){
                success(file)
            }, function(error) {
                failure(error)
            } );

        }, ErrorHandlers.onLocalUrlError(Debug.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

function writeToFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            Debug.lg("Successful file write : " + fileEntry);
            Debug.lg(dataObj);
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}

function tryAuthenticate(success, error) {
    $.ajax({
        type : "POST",
        url : loginURL,

        data : {
            username : savedLogin,
            password : savedPassword,
            testcookies : 1
        },
        success : function(data) {
            success(data);
            Debug.lg("posted");
        },
        error : function(err) {
            Debug.lge(err);
            error(err);
        }
    });

}
//#endregion

module.exports.rewriteLoginPassWord = rewriteLoginPassWord;
module.exports.tryGetLogPassFile = tryGetLogPassFile;
module.exports.passwordValid = passwordValid;
