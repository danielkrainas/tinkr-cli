var interpolate = require('interpolate');
var path = require('path');

var project = require('../project');
var remoteList = require('../remote-list');
var TinkrClient = require('../tinkr-client');

var api = {};

var resolveProjectDir = function (silent) {
    return function (context, next) {
        var currentPath = path.resolve(context.params.projectPath || './');
        var parsedPath = path.parse(currentPath);
        while (true) {
            if (!currentPath || !currentPath.length || currentPath === parsedPath.root) {
                if (!silent) {
                    next(new Error('no project could be found.'));
                } else {
                    next();
                }

                return;
            } else if (project.hasSettings(currentPath)) {
                context.projectPath = currentPath;
                break;
            } else {
                currentPath = path.resolve(path.join(currentPath, '/..'));
                parsedPath = path.parse(currentPath);
            }
        }

        next();
    };
};

var resolveLocalConfigurationDir = function (silent) {
    return function (context, next) {
        var currentPath = path.resolve(context.projectPath || context.params.projectPath || './');
        var parsedPath = path.parse(currentPath);
        while (true) {
            if (!currentPath || !currentPath.length || currentPath === parsedPath.root) {
                if (!silent) {
                    next(new Error('no configuration could be found.'));
                } else {
                    next();
                }

                return;
            } else if (project.hasConfiguration(currentPath)) {
                context.configPath = currentPath;
                break;
            } else {
                currentPath = path.resolve(path.join(currentPath, '/..'));
                parsedPath = path.parse(currentPath);
            }
        }

        next();
    };
};

var ActionBuilder = function () {
    this.pipe = [];
};

ActionBuilder.prototype = api;
module.exports = exports = ActionBuilder;

api.resolveProjectDir = function (silent) {
    return this.use(resolveProjectDir(silent));
};

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
        if (!remoteList.any() && (!context.project || !context.project.remote)) {
            return next(new Error('you must add a remote before you can use that command.'));
        }

        next();
    });
};

api.loadProject = function (silent) {
    this.use(resolveProjectDir(silent));
    
    return this.use(function (context, next) {
        if (!context.projectPath) {
            return next();
        }

        project.readSettings(context.projectPath, function (err, settings) {
            if (err) {
                if (!silent) {
                    next(new Error('could not load project settings'));
                } else {
                    next();
                }
            } else {
                context.project = settings;
                next();
            }
        });
    });
};

api.loadLocalConfiguration = function (silent) {
    this.use(resolveLocalConfigurationDir(silent));

    return this.use(function (context, next) {
        if (!context.configPath) {
            return next();
        }

        project.readConfiguration(context.configPath, function (err, config) {
            if (err) {
                if (!silent) {
                    next(new Error('could not load configuration'));
                } else {
                    next();
                }
            } else {
                context.config = config;
                config.remotes.forEach(function (r) {
                    remoteList.add(r);

                    if (r.default) {
                        context.remotes.push(r);
                    }
                });

                next();
            }
        });
    });
};
