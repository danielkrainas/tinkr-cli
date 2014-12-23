var helpers = require('./helpers');
var interpolate = require('interpolate');

var TinkrClient = require('../tinkr-client');


exports.command = 'add [projectDir]';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(
        helpers.resolveProjectDir(
            helpers.loadProjectSettings(function (projectDir, settings, program) {
                helpers.forEachRemoteTarget(program.parent, 
                    helpers.withTinkrClient(function (client) {
                        client.addProject(settings, function () {
                            console.log(interpolate('[{client.remote}] {name} added.', {
                                name: settings.name,
                                client: client
                            }));
                        });
                    })
                )
            })
        )
    )
);
