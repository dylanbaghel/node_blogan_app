const moment = require('moment');

module.exports = {
    truncate(str, len, end) {
        if (len === null || len === undefined) {
            len = 150;
        }
        if (end === null || end == undefined) {
            end = '...';
        }
        if (str.length < len) {
            return str;
        }
        return str.substring(0, len) + end;
    },
    
    formateDateTime(timestamp) {
        return moment(timestamp).fromNow();
    },

    modifyPost(postCreator, loggedInUser) {
        if (loggedInUser) {
            if (postCreator == loggedInUser) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    itemCount(pageNo, currentIndex, size) {
        if (!pageNo) {
            return currentIndex + 1;
        }

        return (pageNo - 1) * size + currentIndex + 1;
    },

    addComment(postCreator, loggedInUser) {
        if (loggedInUser) {
            if (postCreator !== loggedInUser) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    deleteComment(commentCreator, loggedInUser, postCreator) {
        if (loggedInUser) {
            console.log(commentCreator, postCreator, loggedInUser)
            if (commentCreator === loggedInUser || postCreator === loggedInUser) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    showPrev(pageNo) {
        if (pageNo <= 1 || !pageNo) {
            return false;
        }
        return true;
    },
    showNext(pageNo, pages) {
        if (pageNo === pages || pageNo > pages) {
            return false;
        }
        return true;
    },

    pageCounter(currentPage, totalPages) {
        if (!currentPage) {
            return `1/${totalPages}`;
        }

        return currentPage + "/" + totalPages;
    }
};