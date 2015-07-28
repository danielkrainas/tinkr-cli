var ActionBuilder = require('./action-builder');
var project = require('../project');
var TinkrClient = require('../tinkr-client');
var fmt = require('fmt');


exports.command = 'removesnapshot <name> <version>';

exports.action = new ActionBuilder()
    .loadLocalConfiguration(true)
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.removeSnapshot(context.params.name, context.params.version, function () {
            fmt.title(client.remote.toString('long'));
            fmt.field(project.formatName(context.params), 'removed');
            next();
        });
    })
    .build();