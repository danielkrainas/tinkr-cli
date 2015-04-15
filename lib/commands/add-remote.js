var interpolate = require('interpolate');
var ActionBuilder = require('./action-builder');
var remoteList = require('../remote-list');


exports.command = 'addremote [name] [host]';

exports.action = new ActionBuilder()
    .use(function (context, next) {
        var name = context.params.name;
        var host = context.params.host;
        if (remoteList.containsName(name)) {
            next(new Error('name is already in use'));
        } else if (remoteList.containsHost(host)) {
            next(new Error('host is already in use'));
        } else {
            var remote = {
                name: name,
                host: host
            };

            remoteList.add(remote, function (err) {
                if (err) {
                    return next(err);
                }

                console.log(interpolate('{name} added.', remote));
                next();
            }, true);
        }
    })
    .build();
