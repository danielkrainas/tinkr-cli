var ActionBuilder = require('./action-builder');
var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');


exports.command = 'add [projectDir]';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .resolveProjectDir()
    .loadProjectSettings()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.addProject(context.project, function () {
            console.log(interpolate('[{client.remote}] {name} added.', {
                name: context.project.name,
                client: client
            }));

            next();
        });
    })
    .build();
