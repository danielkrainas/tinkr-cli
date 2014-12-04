var interpolate = require('interpolate');
var path = require('path');

var project = require('../project');
var remoteList = require('../remote-list');

var getProgram = function (args) {
    return args[args.length - 1].parent;
};

exports.doForEachRemoteTarget = function (fn) {
    return function () {
        var program = getProgram(arguments);
        exports.forEachRemoteTarget(program, fn);
    };
};

exports.forEachRemoteTarget = function (program, fn) {
    if (program.allRemotes) {
        remoteList.forEach(fn);
    } else {
        program.remote.forEach(fn);
    }
};

exports.mustSpecifyRemote = function (fn) {
    return function () {
        var program = getProgram(arguments);
        if (!program.allRemotes && (!program.remote || !program.remote.length)) {
            console.log('you must specify a remote target');
            return;
        }

        return fn.apply(null, arguments);
    };
};

exports.mustHaveRemotes = function (fn) {
    return function () {
        if (!remoteList.any()) {
            console.log('you must add a remote before you can use that command.');
            return;
        }

        return fn.apply(null, arguments);
    };
};

exports.resolveProjectDir = function (fn) {
    return function () {
        arguments[0] = path.resolve(arguments[0] || __dirname);
        return fn.apply(null, arguments);
    };
};

exports.loadProjectSettings = function (fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        project.readSettings(args[0], function (err, settings) {
            if (err) {
                return console.log('cannot read tinkr.toml');
            }

            args.splice(-1, 0, settings);
            return fn.apply(null, args);
        });
    };
};
