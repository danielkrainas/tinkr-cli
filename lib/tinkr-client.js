var rest = require('restler');
var fs = require('fs');
var _ = require('lodash');
var safeParse = require('safe-json-parse/callback');
var ujoin = require('url-join');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var interpolate = require('interpolate');
var path = require('path');

var TinkrClient = function (remote) {
    remote = remote && remote.host ? remote : { host: remote || '', name: '' };
    var client = this;
    //var rest = new RestClient();

    /*rest.on('error', function (err) {
        client.emit('error', err);
    });*/

    var filterError = function (fn) {
        return function (result) {
            if (result instanceof Error) {
                client.emit('error', result);
            } else {
                fn.apply(this, arguments);
            }
        };
    };

    var fullpath = function (path) {
        return ujoin(remote, path);
    };

    var parseData = function (data, callback, defaultData) {
        data = data || defaultData;
        if (_.isString(data)) {
            safeParse(data, function (err, data) {
                if (err) {
                    return client.emit('error', err);
                }

                callback(data);
            });
        } else {
            callback(data);
        }
    };

    var get = function (path, data, callback) {
        if (arguments.length === 2) {
            callback = data;
            data = null;
        }

        return rest.get(ujoin(remote.host, path), {
            data: data
        }).on('complete', callback);
    };

    var post = function (path, data, callback) {
        return rest.post(ujoin(remote.host, path), {
            data: data
        }).on('complete', callback);
    };

    Object.defineProperties(this, {
        remote: {
            writable: false,
            value: remote
        },

        restClient: {
            get: function () {
                return rest;
            },
            set: function (value) {
                if (!value) {
                    throw new Error('the rest client cannot be null.');
                }

                rest = value;
            }
        },

        getProjects: {
            writable: false,
            value: function (callback) {
                get('/projects', filterError(function (data) {
                    parseData(data, callback, []);
                }));
            }
        },

        addProject: {
            writable: false,
            value: function (projectSettings, callback) {
                rest.post(ujoin(remote.host, '/projects'), {
                    data: projectSettings
                }).on('complete', filterError(callback));
            }
        },

        removeProject: {
            writable: false,
            value: function (name, callback) {
                rest.del(ujoin(remote.host, interpolate('/project/{name}', { name: name }))).on('complete', filterError(function (data) {
                    callback();
                }));
            }
        },

        getStubs: {
            writable: false,
            value: function (callback) {
                get('/stubs', filterError(function (data) {
                    parseData(data, callback, []);
                }));
            }
        },

        pushStub: {
            writable: false,
            value: function (stub, callback) {
                post('/stubs', JSON.stringify(stub), filterError(callback));
            }
        },

        removeStub: {
            writable: false,
            value: function (name, callback) {
                rest.delete(ujoin(remote.host, '/stub/${stub}'), {
                    path: {
                        stub: name
                    }
                }, function (data, response) {
                    if (response.statusCode !== 200) {
                        return client.emit('error', data);
                    }

                    callback();
                });
            }
        },

        getProjectSnapshots: {
            writable: false,
            value: function (project, callback) {
                rest.get(ujoin(remote.host, interpolate('/project/{name}/snapshots', project)), {
                    path: {
                        project: project
                    }
                }, function (data, response) {
                    parseData(data, callback, []);
                });
            }
        },

        pushSnapshot: {
            writable: false,
            value: function (projectSettings, snapshotPath, options, callback) {
                var snapshotStat = fs.statSync(snapshotPath);
                rest.post(ujoin(remote.host, interpolate('/project/{name}/snapshots', projectSettings)), {
                    multipart: true,
                    data: {
                        project: rest.data('tinkr.toml', 'application/json', JSON.stringify(projectSettings)),
                        snapshot: rest.file(snapshotPath, null, snapshotStat.size, 'utf8', 'application/zip')
                    }
                }).on('complete', filterError(function () {
                    callback();
                }));
            }
        },

        removeSnapshot: {
            writable: false,
            value: function (name, version, callback) {
                rest.del(ujoin(remote.host, interpolate('/project/{name}/snapshots/{version}', {
                    name: name,
                    version: version
                }))).on('complete', filterError(function () {
                    callback();
                }));
            }
        },

        changeProjectState: {
            writable: false,
            value: function (name, version, action, callback) {
                if (arguments.length === 3) {
                    callback = action;
                    action = version;
                    version = null;
                }
                
                rest.postJson(ujoin(remote.host, interpolate('/project/{name}/state/{action}', {
                    name: name,
                    action: action
                }, {
                    timeout: 1000 * 120
                })), {
                    version: version
                }).on('complete', filterError(function () {
                    callback();
                }));
            }
        },

        setEnvVar: {
            writable: false,
            value: function (name, version, key, value, callback) {
                rest.post(ujoin(remote.host, interpolate('/project/{name}/snapshots/{version}/env', {
                    name: name,
                    version: version
                })), {
                    data: {
                        key: key,
                        value: value
                    }
                }).on('complete', filterError(function () {
                    callback();
                }));
            }
        },

        delEnvVar: {
            writable: false,
            value: function (name, version, key, callback) {
                rest.del(ujoin(remote.host, interpolate('/project/{name}/snapshots/{version}/env/{key}', {
                    name: name,
                    version: version,
                    key: key
                }))).on('complete', filterError(function () {
                    callback();
                }));
            }
        }
    });
};

util.inherits(TinkrClient, EventEmitter);

module.exports = exports = TinkrClient;
