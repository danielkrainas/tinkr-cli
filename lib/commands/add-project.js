var ActionBuilder = require('./action-builder');
var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');


exports.command = 'add [projectDir]';

exports.action = new ActionBuilder()
    .loadProject()
    .mustHaveRemotes()
    .targetProjectRemoteIfNone()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.addProject(context.project, function () {
            console.log(interpolate('[{remote.name}] {name} added.', {
                name: context.project.name,
                remote: client.remote
            }));

            next();
        });
    })
    .build();
