var ActionBuilder = require('./action-builder');
var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');


exports.command = 'remove [name]';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.removeProject(context.params.name, function () {
            console.log(interpolate('[{client.remote}] {name} removed.', {
                name: context.params.name,
                client: client
            }));

            next();
        });
    })
    .build();
