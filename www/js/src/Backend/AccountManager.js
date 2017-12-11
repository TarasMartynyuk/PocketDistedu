//#region defs
var Debug = require('./Debug');
var ErrorHandlers = require('./ErrorHandlers');

var loginPassWordFileName = "loginCredentials.txt";
var logPasBackupName = "loginCredentialsBACKUP.txt";
var loginURL = "http://distedu.ukma.edu.ua/login/index.php";
var savedLogin;
var savedPassword;
//#endregion

// successCallback recieves {login, password} as argument
// errorCallback will recieve a string
function savedPasswordValid(successCallback, errorCallback) {
    // first check if file exists
    Debug.lg("SAVED PASSWORD VALID FUNC");
    
    getLoginPassword(function(logPas){
        // try to login into distedu
        savedLogin = logPas.login;
        savedPassword = logPas.password;
        // Debug.lg(savedLogin);
        // Debug.lg(savedPassword);
        passwordValid({
            login : savedLogin,
            password : savedPassword
        }, successCallback, errorCallback);

    }, function(error) {
      errorCallback(error);
    });
}

// success takes 0 arguments
// failure takes error obj as argument
function rewriteLoginPassWord(newLogin, newPassword) {

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        var logPassDirPath = fs.root
        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
            cacheRootDir.getFile(loginPassWordFileName, {create : true}, function (file){
                Debug.lg("created : " + file.toURL());
                // Debug.lg("toURL() : " + );
                // Debug.lg("fullpath : " + file.fullPath);
                Debug.lg(newLogin);
                Debug.lg(newPassword);
                
                writeToFile(file, new Blob([newLogin + "\n" + newPassword]));
                
            }, ErrorHandlers.onLocalUrlError(loginPassWordFileName));
        }, ErrorHandlers.onLocalUrlError(Debug.cacheRootPath));
    }), function(error){
        // failure(error);
    }
}

// success recieves loginned page as argument
function getAuthPage(success, error) {
    tryAuthenticate(savedLogin, savedPassword, success, error);
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

// if pass is valid calls success callback with login and password passed as parameters
// else passes error to errorCallback and calls it
function passwordValid(logPas, successCallback, errorCallback) {

    Debug.lg("PASSWORD VALID FUNC");
    Debug.lg(logPas.login);
    Debug.lg(logPas.password);
    
    tryAuthenticate(logPas,  function(postResult) {
        // the server returns login page if the password/name was not valid
        Debug.lg(" POST RESULT : \n\n\n" );
        Debug.lg($(postResult).filter('title').text());

        if(postResult.search('id=\"login-index\"') < 0) {
            Debug.lg("PASS VALID");
            successCallback(logPas);

        } else {
            errorCallback("the saved login and password did not pass the authentication");
        }

    }, function (error) {
        Debug.lge(error);
    });
}

// success takes authPage and logPas as arguments 
function tryAuthenticate(logPas, success, error) {
    Debug.lg("AUTH  FUNC");
    Debug.lg(" AUTH\n" + logPas.login);
    Debug.lg(" AUTH\n" + logPas.password);
    
    $.ajax({
        type : "POST",
        url : loginURL,
        data : {
            username : logPas.login,
            password : logPas.password,
            testcookies : 1
        },
        success : function(data) {
            success(data);
        },
        error : function(err) {
            error("post to login page failed : \n");
            Debug.lge(err);
        }
    });
}
// success takes 0 arguments
function writeToFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).

    Debug.lg("dataobj " + dataObj);
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            // Debug.lg("Successful file write : " + fileEntry);
            // Debug.lg(dataObj);
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}
//#endregion

module.exports.rewriteLoginPassWord = rewriteLoginPassWord;
module.exports.savedPasswordValid = savedPasswordValid;
module.exports.getLoginPassword = getLoginPassword;
module.exports.getAuthPage = getAuthPage;