var fs = require('fs');
var path = require('path');
var ignoreDoc = require('ignore-doc');

var defaultIgnores = [
    '.tinkr',
    '.tinkrignore',
    '.gitignore'
];

var getNativePath = function (dir) {
    return path.join(dir, '.tinkrignore');
};

var getGitPath = function (dir) {
    return path.join(dir, '.gitignore');
};

var handleErrorOrMakeFilter = function (callback) {
    return function (err, data) {
        if (err) {
            return callback(err);
        }

        callback(null, ignoreDoc(data, defaultIgnores));
    };
};

var hasGit = exports.hasGit = function (dir) {
    return fs.existsSync(getGitPath(dir));
};

var hasNative = exports.hasNative = function (dir) {
    return fs.existsSync(getNativePath(dir));
};

var getNative = exports.getNative = function (dir, callback) {
    fs.readFile(getNativePath(dir), handleErrorOrMakeFilter(callback));
};

var getGit = exports.getGit = function (dir, callback) {
    fs.readFile(getGitPath(dir), handleErrorOrMakeFilter(callback));
};

exports.getNativeOrGit = function (dir, callback) {
    if (hasNative(dir)) {
        getNative(dir, callback);
    } else if (hasGit(dir)) {
        getGit(dir, callback);
    } else {
        callback(null, []);
    }
};
