var Debug = require('./Debug');
var currDate = new Date(2017, 11, 13);

// deadline : Date obj
// returns -1 if the deadline has passed,
// 0 if deadline is in range of cachable assignments
// and 1 if it is further in the future
function deadlineStatus(deadline) {

    // Debug.lg("deadline : ");
    // Debug.lg(deadline);
    
    var differenceInWeeks = (deadline - currDate) / 604800000;

    // Debug.lg("diff" + differenceInWeeks);

    if(differenceInWeeks >= 1) {
        return 1;
    } else if (differenceInWeeks > 0) {
        return 0;
    } else {
        return -1;
    }

}

function printDate(){
    Debug.lg("today is : " + currDate.getDate());
    Debug.lg("of month " + currDate.getMonth());
    // Debug.lg(currDate);
}

module.exports.deadlineStatus = deadlineStatus;
module.exports.printDate = printDate;
