var helpers = require('./helpers');
var TinkrClient = require('../tinkr-client');


exports.command = 'addstub [projectDir]';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(
        helpers.resolveProjectDir(
            helpers.loadProjectSettings(function (projectDir, settings, program) {
                helpers.forEachRemoteTarget(program.parent, 
                    helpers.withTinkrClient(function (client) {
                        client.pushStub(settings, function () {
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
