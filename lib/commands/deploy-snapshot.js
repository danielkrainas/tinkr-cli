var interpolate = require('interpolate');

var helpers = require('./helpers');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'deploy [projectDir]';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(
        helpers.resolveProjectDir(
            helpers.loadProjectSettings(function (projectDir, settings) {
                project.snapshot(projectDir, settings, function (err, snapshotPath) {
                    if (err) {
                        return console.log('could not create a snapshot.');
                    }

                    helpers.doForEachRemoteTarget(function (remote) {
                        var client = new TinkrClient(remote);
                        client.pushSnapshot(settings, snapshotPath, {

                        }, function (err) {
                            if (err) {
                                console.log(interpolate('could not deploy {project.name}#{project.version} to {remote.name}', {
                                    project: settings,
                                    remote: remote
                                }));

                                return console.log(err);
                            }

                            console.log('deployed to: ' + remote);
                        });
                    });
                });
            })
        )
    )
);