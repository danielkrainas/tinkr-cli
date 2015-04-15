var ActionBuilder = require('./action-builder');
var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');


exports.command = 'remove [name]';

exports.action = new ActionBuilder()
    .resolveProject(true)
    .mustHaveRemotes()
    .targetProjectRemoteIfNone()
    .mustSpecifyRemote()
    .use(function (context, next) {
        context.params.name = context.params.name || null;
        if (context.project && context.params.name === null) {
            context.params.name = context.project.name;
        }

        next();
    })
    .forEachRemoteTargetClient(function (client, context, next) {
        client.removeProject(context.params.name, function () {
            console.log(interpolate('[{remote.name}] {name} removed.', {
                name: context.params.name,
                remote: client.remote
            }));

            next();
        });
    })
    .build();
