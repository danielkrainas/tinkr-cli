var helpers = require('./helpers');
var TinkrClient = require('../tinkr-client');


exports.command = 'add-stub [projectDir]';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(
        helpers.resolveProjectDir(
            helpers.loadProjectSettings(function (projectDir, settings, program) {
                helpers.forEachRemoteTarget(program.parent, function (remote) {
                    var client = new TinkrClient(remote);
                    client.pushStub(settings, function (err, result) {
                        console.log(err);
                    });
                });
            })
        )
    )
);
