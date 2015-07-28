var fmt = require('fmt');

var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');


exports.command = 'remove [name]';

exports.action = new ActionBuilder()
    .loadLocalConfiguration(true)
    .loadProject(true)
    .mustHaveRemotes()
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
            fmt.title(client.remote.toString('long'));
            fmt.field(context.params.name, 'removed');
            next();
        });
    })
    .build();
