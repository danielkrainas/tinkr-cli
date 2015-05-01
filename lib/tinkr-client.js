var Service = require('restler').Service;
var fs = require('fs');
var _ = require('lodash');
var safeParse = require('safe-json-parse/callback');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var interpolate = require('interpolate');
var path = require('path');

var TinkrClient = function (remote) {
    remote = remote && remote.host ? remote : { host: remote || '', name: '' };
    var client = this;
    var service = new Service({
        baseURL: remote.host
    });

    var filterError = function (fn) {
        return function (result) {
            if (result instanceof Error) {
                client.emit('error', result);
            } else {
                fn.apply(this, arguments);
            }
        };
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

    Object.defineProperties(this, {
        remote: {
            writable: false,
            value: remote
        },

        service: {
            get: function () {
                return service;
            },
            set: function (value) {
                if (!value) {
                    throw new Error('the service cannot be null.');
                }

                service = value;
            }
        },

        getProjects: {
            writable: false,
            value: function (callback) {
                service.get('/projects')
                .on('complete', filterError(function (data) {
                    parseData(data, callback, []);
                }));
            }
        },

        addProject: {
            writable: false,
            value: function (projectSettings, callback) {
                service.post('/projects', {
                    data: projectSettings
                }).on('complete', filterError(callback));
            }
        },

        removeProject: {
            writable: false,
            value: function (name, callback) {
                service.del(interpolate('/project/{name}', { name: name }))
                .on('complete', filterError(callback));
            }
        },

        getStubs: {
            writable: false,
            value: function (callback) {
                service.get('/stubs')
                .on('complete', filterError(function (data) {
                    parseData(data, callback, []);
                }));
            }
        },

        pushStub: {
            writable: false,
            value: function (stub, callback) {
                service.post('/stubs', {
                    data: JSON.stringify(stub)
                }).on('complete', filterError(callback));
            }
        },

        removeStub: {
            writable: false,
            value: function (name, callback) {
                service.del(interpolate('/stub/{stub}', { stub: stub }))
                .on('complete', filterError(function (data, response) {
                    if (response.statusCode !== 200) {
                        return client.emit('error', data);
                    }

                    callback();
                }));
            }
        },

        getProjectSnapshots: {
            writable: false,
            value: function (project, callback) {
                service.get(interpolate('/project/{name}/snapshots', project))
                .on('complete', filterError(function (data, response) {
                    parseData(data, callback, []);
                }));
            }
        },

        pushSnapshot: {
            writable: false,
            value: function (projectSettings, snapshotPath, options, callback) {
                var snapshotStat = fs.statSync(snapshotPath);
                service.post(interpolate('/project/{name}/snapshots', projectSettings), {
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
                service.del(interpolate('/project/{name}/snapshots/{version}', {
                    name: name,
                    version: version
                })).on('complete', filterError(function () {
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
                
                service.postJson(interpolate('/project/{name}/state/{action}', {
                    name: name,
                    action: action
                }, {
                    timeout: 1000 * 120
                }), {
                    version: version
                }).on('complete', filterError(function () {
                    callback();
                }));
            }
        },

        setEnvVar: {
            writable: false,
            value: function (name, version, key, value, callback) {
                service.post(interpolate('/project/{name}/snapshots/{version}/env', {
                    name: name,
                    version: version
                }), {
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
                service.del(interpolate('/project/{name}/snapshots/{version}/env/{key}', {
                    name: name,
                    version: version,
                    key: key
                })).on('complete', filterError(function () {
                    callback();
                }));
            }
        }
    });
};

util.inherits(TinkrClient, EventEmitter);

module.exports = exports = TinkrClient;
