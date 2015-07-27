var interpolate = require('interpolate');
var fmt = require('fmt');

var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');


exports.command = 'add [projectDir]';

exports.action = new ActionBuilder()
    .loadLocalConfiguration(true)
    .loadProject()
    .mustHaveRemotes()
    .targetProjectRemoteIfNone()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        fmt.title(client.remote.toString('long'));
        client.addProject(context.project, function () {
            fmt.field(context.project.name, 'added successfully!');
            next();
        });
    })
    .build();
