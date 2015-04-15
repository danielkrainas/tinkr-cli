var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');


exports.command = 'addstub [projectDir]';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .resolveProjectDir()
    .loadProjectSettings()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.pushStub(context.program, function () {
            console.log(interpolate('[{client.remote}] {name} added.', {
                name: context.program.name,
                client: client
            }));

            next();
        });
    })
    .build();
