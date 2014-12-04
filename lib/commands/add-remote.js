var interpolate = require('interpolate');

var remoteList = require('../remote-list');


exports.command = 'add-remote [name] [host]';

exports.action = function (name, host) {
    if (remoteList.containsName(name)) {
        console.log('name is already in use');
    } else if (remoteList.containsHost(host)) {
        console.log('host is already in use');
    } else {
        var remote = {
            name: name,
            host: host
        };

        remoteList.add(remote, function (err) {
            if (!err) {
                console.log(interpolate('{name} added.', remote));
            }
        }, true);
    }
};
