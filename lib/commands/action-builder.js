var interpolate = require('interpolate');
var path = require('path');

var project = require('../project');
var remoteList = require('../remote-list');
var TinkrClient = require('../tinkr-client');

var api = {};

var ActionBuilder = function () {
    this.pipe = [];
};

ActionBuilder.prototype = api;
module.exports = exports = ActionBuilder;

api.build = function () {
    var i = 0;
    var pipe = this.pipe;
    var context = {
        params: {}
    };

    return function () {
        var cmd = this;

        var next = function (err) {
            if (arguments.length === 1 && typeof err !== 'undefined' && err !== null) {
                console.error(err.toString());
                return;
            } else if (i >= pipe.length) {
                return;
            }

            setTimeout(function () {
                var fn = pipe[i++];
                fn.call(null, context, next);
            }, 0);
        };

        context.remotes = [];
        context.program = arguments[arguments.length - 1].parent;
        if (context.program.allRemotes) {
            remoteList.forEach(function (remote) {
                context.remotes.push(remote);
            });
        } else if (context.program.remote) {
            context.remotes = context.program.remote.slice(0);
        }

        var args = Array.prototype.slice.call(arguments, 0);
        cmd._args.forEach(function (arg, i) {
            context.params[arg.name] = args[i];
        });

        next();
    };
};

api.use = function (middleware) {
    this.pipe.push(middleware);
    return this;
};

api.targetProjectRemoteIfNone = function () {
    return this.use(function (context, next) {
        if (context.remotes.length <= 0 && context.project.remote) {
            context.remotes.push(context.project.remote);
        }

        next();
    });
};

api.forEachRemoteTargetClient = function (fn) {
    var i = 0;
    return this.use(function (context, next) {
        var nextRemote = function (err) {
            if (arguments.length === 1) {
                return next(err);
            } else if (i >= context.remotes.length) {
                return next();
            }

            setTimeout(function () {
                var remote = context.remotes[i++];
                var client = new TinkrClient(remote);
                fn.call(null, client, context, nextRemote);
            }, 0);
        };

        nextRemote();
    });
};

api.takeProjectSnapshot = function () {
    return this.use(function (context, next) {
        project.snapshot(context.projectPath, context.project, function (err, snapshotPath) {
            if (err) {
                console.error('could not create snapshot.');
                return next(err);
            }

            context.snapshotPath = snapshotPath;
            console.log('snapshot created: ' + snapshotPath);
            next();
        });
    });
};

api.mustSpecifyRemote = function () {
    return this.use(function (context, next) {
        if (!context.remotes.length) {
            return next(new Error('you must specify a remote target'));
        }

        next();
    });
};

api.mustHaveRemotes = function () {
    return this.use(function (context, next) {
        if (remoteList.any()) {
            return next(new Error('you must add a remote before you can use that command.'));
        }

        next();
    });
};

api.resolveProjectDir = function () {
    return this.use(function (context, next) {
        context.projectPath = path.resolve(context.projectPath || './');
        next();
    });
};

api.loadProjectSettings = function () {
    return this.use(function (context, next) {
        project.readSettings(context.projectPath, function (err, settings) {
            if (err) {
                return next(err);
            }

            context.project = settings;
            next();
        });
    });
};
