var interpolate = require('interpolate');

var ActionBuilder = require('./action-builder');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'deploy [projectDir]';

exports.action = new ActionBuilder()
    .resolveProjectDir()
    .loadProjectSettings()
    .targetProjectRemoteIfNone()
    .mustSpecifyRemote()
    .takeProjectSnapshot()
    .use(function (context, next) {
        console.log(context.remotes);
    })
    .forEachRemoteTargetClient(function (client, context, next) {
        console.log(interpolate('deploying to {name}', client.remote));
        client.pushSnapshot(context.project, context.snapshotPath, {}, function (err) {
            if (err) {
                console.log(interpolate('could not deploy {project.name}#{project.version} to {remote.name}', {
                    project: context.project,
                    remote: client.remote
                }));

                return next(err);
            }

            console.log(interpolate('deployed to: {name}', client.remote));
            next();
        });
    })
    .build();
