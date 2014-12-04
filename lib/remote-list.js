var fse = require('fs-extra');
var _ = require('lodash');
var path = require('path');
//var util = require('util');
//var events = require('events');
//var emitter = new events.EventEmitter();

var CONFIG_FILE = path.normalize(path.join(__dirname, '..', 'remotes.json'));
var remotes = [];

//module.exports = exports = emitter;

exports.load = function (callback) {
    fse.readJson(CONFIG_FILE, function (err, remotes) {
        if (err) {
            throw err;
        }

        remotes.forEach(function (remote) {
            exports.add(remote, null, false);
        });

        callback();
    });
};

exports.containsName = function (name) {
    return !!exports.getByName(name);
};

exports.getByName = function (name) {
    for (var i = 0; i < remotes.length; i++) {
        if (remotes[i].name == name) {
            return remotes[i];
        }
    }

    return null;
};

exports.containsHost = function (host) {
    for (var i = 0; i < remotes.length; i++) {
        if (remotes[i].host == host) {
            return true;
        }
    }

    return false;
};

exports.add = function (remote, callback, persist) {
    if (!~remotes.indexOf(remote)) {
        remotes.push(remote);
        //emitter.emit('added', stub);
        if (persist) {
            return exports.save(callback);
        }
    }

    if (callback) {
        callback();
    }
};

exports.remove = function (name, callback, persist) {
    var match = null;
    var index = 0;
    for (var i = 0; i < remotes.length; i++) {
        var r = remotes[i];
        if (r.name == name) {
            match = remotes[i];
            index = i;
            break;
        }
    }

    if (match) {
        remotes.splice(index, 1);
        //emitter.emit('removed', stub);
        if (persist) {
            return exports.save(callback);
        }
    }

    callback();
};

exports.save = function (callback) {
    fse.outputJson(CONFIG_FILE, remotes, callback);
};

exports.any = function () {
    return !!remotes.length;
};

exports.forEach = function (fn) {
    remotes.forEach(fn);
};

exports.forEachIn = function (names, fn) {
    remotes.forEach(function (remote) {
        if (~names.indexOf(remote.name)) {
            fn(remote);
        }
    });
};
