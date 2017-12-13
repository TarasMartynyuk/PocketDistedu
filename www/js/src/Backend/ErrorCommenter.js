function addCommentPrefix(error, comment) {
    return new Error(comment + " , threw such error:\n" + error.message);
}

module.exports.addCommentPrefix = addCommentPrefix;