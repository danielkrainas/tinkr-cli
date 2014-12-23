var interpolate = require('interpolate');

var remoteList = require('../remote-list');
var helpers = require('./helpers');


exports.command = 'removeremote [name]';

exports.action = helpers.mustHaveRemotes(function (name) {
    if (!remoteList.containsName(name)) {
        console.log(interpolate('{0} not found.', [name]));
    } else {
        remoteList.remove(name, function (err) {
            if (!err) {
                console.log(interpolate('{0} removed.', [name]));
            }
        }, true);
    }
});
