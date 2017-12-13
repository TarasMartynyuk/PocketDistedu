//#region defs
var Debug = require('./Debug');
var FileWriter = require('./FileWriter');
var ErrorCommenter = require('./ErrorCommenter');

var loginPassWordFileName = "loginCredentials.txt";
var logPasBackupName = "loginCredentialsBACKUP.txt";
var loginURL = "http://distedu.ukma.edu.ua/login/index.php";
var savedLogin;
var savedPassword;
//#endregion

// loads login and password to memory
// successCallback recieves {login, password} as argument
// errorCallback will recieve a string
function savedPasswordValid(successCallback, errorCallback) {
    // first check if file exists
    // Debug.lg("SAVED PASSWORD VALID FUNC");
    
    getLoginPassword(function(logPas){
        // try to login into distedu
        savedLogin = logPas.login;
        savedPassword = logPas.password;
        Debug.lg("loaded : " + savedLogin);
        Debug.lg("loaded : " + savedPassword);
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
function rewriteLoginPassWord(newLogin, newPassword, success, failure) {

        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
            cacheRootDir.getFile(loginPassWordFileName, {create : true}, function (file){
                Debug.lg("created : " + file.toURL());
                
                FileWriter.write(file, new Blob([newLogin + "\n" + newPassword]), success, failure);
                
            }, function(error) {
                var commentedError = ErrorCommenter.addCommentPrefix(error, 'Error resolving URL : ' + Debug.cacheRootPath + loginPassWordFileName);
                failure(commentedError);
            });
        }, function(error) {
            var commentedError = ErrorCommenter.addCommentPrefix(error, 'Error resolving URL : ' + Debug.cacheRootPath);
            failure(commentedError);
        });
}

// success recieves loginned page as argument
function getAuthPage(success, failure) {
    tryAuthenticate({ login : savedLogin,
        password : savedPassword
    }, success, failure);
}

// if pass is valid calls success callback with login and password passed as parameters
// else passes error to errorCallback and calls it
function passwordValid(logPas, success, failure) {

    // Debug.lg("PASSWORD VALID FUNC");
    
    tryAuthenticate(logPas,  function(postResult) {
        // the server returns login page if the password/name was not valid
        Debug.lg(" POST RESULT : ");
        Debug.lg($(postResult).filter('title').text());

        if(postResult.search('id=\"login-index\"') < 0) {
            Debug.lg("PASS VALID");
            success(logPas);

        } else {
            failure(new Error("the saved login and password did not pass the authentication"));
        }

    }, function (error) {
        failure(commentedError);
    });
}

//#region helpers
// success takes authPage and logPas as arguments 
function tryAuthenticate(logPas, success, failure) {
    Debug.lg("AUTH  FUNC");
    // Debug.lg(" AUTH\n" + logPas.login);
    // Debug.lg(" AUTH\n" + logPas.password);
    Debug.lg("posting to : " + loginURL);
    $.ajax({
        type : "POST",
        url : loginURL, // + "NOT FVASADJKASDJKLAS",
        data : {
            username : logPas.login,
            password : logPas.password,
            testcookies : 1
        },
        success : function(data) {
            success(data);
        },
        error : function(error) {
            error(" : \n");
            Debug.lge("Server Error .responseText : " + err.responseText);

            var commentedError = ErrorCommenter.addCommentPrefix(error, 'post to login page failed - ' + loginURL);
            failure(commentedError);
        }
    });
}

// success recieves file as argument
function tryGetLogPassFile(success, failure){
    
        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
            
            cacheRootDir.getFile(loginPassWordFileName, {create : false}, function(file){
                success(file);
            }, function(error) {
                var commentedError = ErrorCommenter.addCommentPrefix(error, 'Error resolving URL : ' + Debug.cacheRootPath + loginPassWordFileName);
                Debug.lg("getlogpas : " + error);
                Debug.lg("getlogpas message: " + error.message);
                
        
                failure(commentedError);
            } );

        }, function(error) {
            var commentedError = ErrorCommenter.addCommentPrefix(error, 'Error resolving URL : ' + Debug.cacheRootPath);
            failure(commentedError);
        });
    }
// success takes 0 arguments


// successCallback recieves {login, password} as argument
function getLoginPassword(success, failure) {
    
    tryGetLogPassFile(function(fileEntry){
        // attempt to read login and password
        fileEntry.file(function (file) {
            var reader = new FileReader();
    
            reader.onloadend = function() {
                Debug.lg("Success reading file " + file);
                var contents = this.result.split('\n');

                success({
                    login : contents[0],
                    password : contents[1]
                });
            };
            reader.readAsText(file);
        }, function(error) {
            var commentedError = ErrorCommenter.addCommentPrefix(error, 'Error reading  file ' + filename);
            failure(commentedError);
        });

    }, function(error) {
        var commentedError = ErrorCommenter.addCommentPrefix(error, "login-password file does not exist yet -");
        failure(commentedError);
    });
}

// returnnes new erorr obj, whose message will have comment appended at start

//#endregion

module.exports.rewriteLoginPassWord = rewriteLoginPassWord;
module.exports.pass = rewriteLoginPassWord;

module.exports.passwordValid = passwordValid;
module.exports.getAuthPage = getAuthPage;