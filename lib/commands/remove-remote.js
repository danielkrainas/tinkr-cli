var interpolate = require('interpolate');

var remoteList = require('../remote-list');
var ActionBuilder = require('./action-builder');


exports.command = 'removeremote [name]';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .use(function (context, next) {
        var name = context.params.name;
        if (!remoteList.containsName(name)) {
            console.log(interpolate('{0} not found.', [name]));
        } else {
            remoteList.remove(name, function (err) {
                if (err) {
                    return next(err);
                }

                console.log(interpolate('{0} removed.', [name]));
            }, true);
        }
    })
    .build();
