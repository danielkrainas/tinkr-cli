var interpolate = require('interpolate');
var fmt = require('fmt');

var ActionBuilder = require('./action-builder');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'deploy [projectDir]';

exports.action = new ActionBuilder()
    .loadLocalConfiguration(true)
    .loadProject()
    .mustSpecifyRemote()
    .takeProjectSnapshot()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.pushSnapshot(context.project, context.snapshotPath, {}, function (err) {
            fmt.title(client.remote.toString('long'));
            if (err) {
                console.log(interpolate('could not deploy {project.name}#{project.version} to {remote}', {
                    project: context.project,
                    remote: client.remote
                }));

                return next(err);
            }

            console.log(interpolate('deployed to: {remote}', client));
            next();
        });
    })
    .build();
