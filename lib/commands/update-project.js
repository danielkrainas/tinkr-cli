var interpolate = require('interpolate');
var fmt = require('fmt');

var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');


exports.command = 'update [projectDir]';

exports.action = new ActionBuilder()
    .loadLocalConfiguration(true)
    .loadProject()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        fmt.title(client.remote.toString('long'));
        client.updateProject(context.project, function () {
            fmt.field(context.project.name, 'updated successfully!');
            next();
        });
    })
    .build();
