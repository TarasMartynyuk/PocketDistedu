var AccountManager = require('./AccountManager');

// returns list of all courses of user (using his data from AccountManager), 
// in format [{ string_name : int_id, otherEntry, ...}]
function getAllCoursesList() {
    // first, get the after-login page
    AccountManager.tryAuthenticate(function(afterLoginPage){
        

        
    }, function(error){

    });
}

module.exports.getAllCoursesList = getAllCoursesList;