//#region defs
var Debug = require('./Debug');
var JSSoup = require('jssoup').default;
var ErrorHandlers = require('./ErrorHandlers');
var loginPassWordFileName = "loginCredentials.txt";
var logPasBackupName = "loginCredentialsBACKUP.txt";
var loginURL = "http://distedu.ukma.edu.ua/login/index.php";
// var secureURLTest = "http://distedu.ukma.edu.ua/mod/resource/index.php?id=131";
var savedLogin;
var savedPassword;
//#endregion

// successCallback recieves {login, password} as argument
// errorCallback will recieve a string
function passwordValid(successCallback, errorCallback) {
    // first check if file exists
    getLoginPassword(function(logPas){
        // try to login into distedu
        savedLogin = logPas.login;
        savedPassword = logPas.password;
        Debug.lg(savedLogin);
        Debug.lg(savedPassword);

        tryAuthenticate( function(postResult) {
            // the server returns login page if the password/name was not valid
            Debug.lg(" POST RESULT : \n\n\n" );
            // Debug.lg($(postResult).filter('title').html());
            // $('#parser').text("test");
            // $('#parser').html(postResult);            

            Debug.lg(postResult.search('id=\"login-index\"'));
            // $('#parser').load($(""postResult""));
            

            // Debug.lg($('#parser'));

            // var soup = new JSSoup(postResult);
            // Debug.lg(soup.find('.login'));
            
            // loginSelector = $(postResult).filter('text');
            // Debug.lg("login selector : \n\n");
            // Debug.lg(loginSelector);
            // Debug.lg("Selector lenth " + loginSelector.length);
            // Debug.lg(loginSelector.html());
            // Debug.lg("posted");
        }, function (error) {
            Debug.lge(error);
        });

    }, function(error) {
      errorCallback(error);
    });

    // $.ajax({
        //     type : "GET",
        //     url : loginURL,
        //     success : function(data) {
        //         Debug.lg('success with GET\n\n\n');
        //         Debug.lg($(data).filter('title').html());
        //         // Debug.lg(data);
        //     },
        //     error : function(err) {
        //         Debug.lge(err);
        //     }
        //     });
}

// success takes 0 arguments
// failure takes error obj as argument
function rewriteLoginPassWord(newLogin, newPassword, success, failure) {

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        var logPassDirPath = fs.root
        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
            cacheRootDir.getFile(loginPassWordFileName, {create : true}, function (file){
                Debug.lg("created : " + file);
                Debug.lg("toURL() : " + file.toURL());
                Debug.lg("fullpath : " + file.fullPath);
                writeToFile(file, new Blob([newLogin + "\n" + newPassword]), success);
                
            }, ErrorHandlers.onLocalUrlError(loginPassWordFileName));
        }, ErrorHandlers.onLocalUrlError(Debug.cacheRootPath));
    }), function(error){
        failure(error);
    }
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
        },
        error : function(err) {
            error("post to login page failed : \n");
            Debug.lge(err);
        }
    });

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

// success takes 0 arguments
function writeToFile(fileEntry, dataObj, success) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            Debug.lg("Successful file write : " + fileEntry);
            Debug.lg(dataObj);
            success();
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}
//#endregion

module.exports.rewriteLoginPassWord = rewriteLoginPassWord;
module.exports.tryGetLogPassFile = tryGetLogPassFile;
module.exports.passwordValid = passwordValid;
module.exports.tryAuthenticate = tryAuthenticate;