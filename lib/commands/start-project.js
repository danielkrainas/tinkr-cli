var helpers = require('./helpers');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'start <name> [version]';

exports.action = helpers.mustHaveRemotes(
    helpers.mustSpecifyRemote(function (name, version, program) {


        helpers.forEachRemoteTarget(program.parent, 
            helpers.withTinkrClient(function (client) {
                client.changeProjectState(name, version, 'start', function () {
                    console.log('[' + client.remote + '] ' + name + ' starting.');
                });
            })
        );
    })
);
