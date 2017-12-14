var Debug = require('./Debug');
// deadline : Date obj
// returns -1 if the deadline has passed,
// 0 if deadline is in range of cachable assignments
// and 1 if it is further in the future
function deadlineStatus(deadline) {

    var currDate = Date.now();
    // Debug.lg(currDate);
    // Debug.lg("deadline : ");
    // Debug.lg(deadline);
    
    var differenceInWeeks = (deadline - currDate) / 604800000;

    if(differenceInWeeks >= 1) {
        return 1;
    } else if (differenceInWeeks > 0) {
        return 0;
    } else {
        return -1;
    }

}

module.exports.deadlineStatus = deadlineStatus;