var Debug = require("./Debug");
var ErrorHandlers = require("./ErrorHandlers");
var userCourses = [];
var coursesJsonName = "userCourses.json";
const fs = require('fs');

// success takes 0 args, 
// is run when userCourses where successfully retrieved from disk
// failure takes string representing error
function coursesSerialized(success, failure) {

    window.resolveLocalFileSystemURL(Debug.cacheRootPath + coursesJsonName, function(fileEntry){

        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                try {
                    userCourses = JSON.parse(this.result);
                } catch(e) {
                    failure(e);
                }
            };

            reader.readAsText(file);

        }, failure( "cannot read file : "+ Debug.cacheRootPath + coursesJsonName));

    }, failure( "cannot find URL : " + Debug.cacheRootPath + coursesJsonName));

}

// delete courses that are marked as done from disk(if deadline has passed), 
// cache those that are not longer than week from now
function update() {

}

// pass user - filtered array of courses as arg,
// serializes it to be able to use in next sessions
function saveUserCourses(filteredCourses) {
    // window.PERSISTENT, 5 * 1024, function(fs) {
    //     fs.readFile(coursesJsonName, function (error, data){
    //         if(!error) {
    //             success();
    //         } else {
    //             Debug.lg("did not found courses JSON");
    //             failure();
    //         }
    //     });

    // }, function(error){
    //     Debug.lge(error);
    // }
}

//#region 


//#endregion

module.exports.coursesSerialized = coursesSerialized;