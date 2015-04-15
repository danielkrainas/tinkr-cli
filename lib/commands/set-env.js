var ActionBuilder = require('./action-builder');
var project = require('../project');
var TinkrClient = require('../tinkr-client');


exports.command = 'env <name> <version> <pair>';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .use(function (context, next) {
        var kv = (context.params.pair || '=').split('=');
        context.params.pair = {
            key: kv[0],
            value: kv.length === 2 ? kv[1] : null
        };

        next();
    })
    .forEachRemoteTargetClient(function (client, context, next) {
        var name = context.params.name;
        var version = context.params.version;
        var pair = context.params.pair;
        if (!pair.value) {
            client.delEnvVar(name, version, pair.key, function () {
                console.log('[' + client.remote + '] ' + name + '#' + version + '::env.' + pair.key + ' deleted.');
                next();
            });
        } else {
            client.setEnvVar(name, version, pair.key, pair.value, function () {
                console.log('[' + client.remote + '] ' + name + '#' + version + '::env.' + pair.key + ' set.');
                next();
            });
        }
    })
    .build();
