var RestClient = require('node-rest-client').Client,
    _ = require('lodash'),
    safeParse = require('safe-json-parse/callback'),
    ujoin = require('url-join');

var TinkrClient = function (remote) {
    remote = remote.host || remote;
    var client = this;
    var rest = new RestClient();

    rest.on('error', function (err) {
        client.emit('error', err);
    });

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
                rest.get(ujoin(remote, '/projects'), function (data, response) {
                    parseData(data, callback, []);
                });
            }
        },

        getStubs: {
            writable: false,
            value: function (callback) {
                rest.get(ujoin(remote, '/stubs'), function (data, response) {
                    parseData(data, callback, []);
                });
            }
        },

        pushStub: {
            writable: false,
            value: function (stub, callback) {
                rest.post(ujoin(remote, '/stubs'), {
                    data: stub,
                    headers: {
                        'content-type': 'application/json'
                    }
                }, function (data, response) {
                    if (response.statusCode !== 200) {
                        return callback(data);
                    }

                    callback(null, data);
                });
            }
        },

        removeStub: {
            writable: false,
            value: function (name, callback) {
                rest.delete(ujoin(remote, '/stub/${stub}'), {
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
                rest.get(ujoin(remote, '/projects/${project}/snapshots'), {
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
                rest.post(ujoin(remote, '/projects'), {
                    path: {
                        project: project
                    }
                }, function (data, response) {
                    console.log(response);
                });
            }
        }
    });
};

module.exports = exports = TinkrClient;
